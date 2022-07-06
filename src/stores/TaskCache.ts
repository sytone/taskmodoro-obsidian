import { Frontmatter, getDescription } from '../parser'
import TQPlugin from '../main'
import { err, ok, Result } from 'neverthrow'
import { App, TFile } from 'obsidian'
import { Writable, writable, get } from 'svelte/store'
import { TaskDetails } from '../task-details'
import { FilePath, Task, withFileContents } from '../file-interface'
import { Parser } from '../parser'

/**
 * TaskCache is the main interface for querying and modifying tasks. It
 * implements a Svelte store, so changes to the underlying tasks can be
 * automatically reflected in the UI.
 */

export class TaskCache {
  public tasks: Writable<Record<FilePath, Task>>

  private readonly plugin: TQPlugin
  private readonly app: App

  public constructor (plugin: TQPlugin, app: App) {
    this.plugin = plugin
    this.app = app

    this.tasks = writable({})
  }

  /**
   * toggleChecked will update the task file to the state represented in this
   * task object. The task object will not be modified, though the modifiction
   * of the file will trigger that task to be reloaded and the UI to be
   * rerendered.
   */
  public readonly toggleChecked = async (td: TaskDetails): Promise<void> =>
    withFileContents(td.file, this.app.vault, (lines): boolean => {
      const replacer = td.completed ? /^- \[[ ]\]/ : /^- \[[xX]\]/
      const newValue = td.completed ? '- [x]' : '- [ ]'

      // Look for the task and check status
      const taskLine = lines.findIndex(line => replacer.test(line))
      if (taskLine < 0) {
        console.warn(
          'tq: Unable to find a task line to toggle in file ' + td.file.path,
        )
        return false
      }

      lines[taskLine] = lines[taskLine].replace(replacer, newValue)

      // We update this here rather than waiting for the file modified handler
      // so that the file is only updated once, rather than twice in rapid
      // succession.
      this.plugin.fileInterface.processRepeating(td.file.path, lines)

      return true
    })

  /**
   * Update svelte store of tasks by replacing stores` key: (newTask.file.path) with value: (newTask) parsed from modified task file.
   */
  public readonly handleTaskModified = async (file: TFile): Promise<void> => {
    ;(await this.loadTask(file)).match(
      newTask => {
        console.log('tasks-modified: ', newTask.taskName)
        this.tasks.update(
          (tasks): Record<FilePath, Task> => {
            tasks[newTask.file.path] = newTask
            return tasks
          },
        )
      },
      e => {
        console.error(e)
      },
    )
  }

  // We reload parent data in svelte store to represent change in subtask
  public reloadParent = (file: TFile) => {
    let tasksNav = get(this.plugin.taskNav.tasksNavigation)
    let currTask = get(this.tasks)[file.path]
    currTask.parents

    const doesCurrTaskHasTaskNavAsParent = (parentPath: string) => {
      return (
        currTask.parents.findIndex((t: Task) => t.file.path === parentPath) >= 0
      )
    }

    const idx = tasksNav.findIndex(path => {
      return doesCurrTaskHasTaskNavAsParent(path)
    })

    if (idx >= 0) {
      let parentPath = tasksNav[idx - 1]
      let parentFile = this.plugin.app.metadataCache.getFirstLinkpathDest(
        parentPath,
        '/',
      )
      if (parentFile) {
        this.handleTaskModified(parentFile)
      }
    }
  }

  public readonly handleTaskDeleted = (path: string): void => {
    this.tasks.update(
      (tasks): Record<FilePath, Task> => {
        delete tasks[path]
        return tasks
      },
    )
  }

  public readonly getTasksFromFileNames = async (
    fileNames: string[],
  ): Promise<Task[]> => {
    if (!fileNames) return []
    const tasksDir = this.plugin.settings.TasksDir
    const subtasks: Task[] = []
    for (let fileName of fileNames) {
      const path = `${tasksDir}/${fileName}`

      const file = this.app.metadataCache.getFirstLinkpathDest(path, '/')
      if (file) {
        let task = await this.loadTask(file)
        task.match(
          t => {
            subtasks.push(t)
          },
          err => {
            console.debug(err)
          },
        )
      }
    }
    return subtasks
  }

  private readonly loadTask = async (
    file: TFile,
  ): Promise<Result<Task, string>> => {
    const metadata = this.app.metadataCache.getFileCache(file)
    if (
      metadata?.listItems ||
      metadata.listItems.length < 1 ||
      metadata.listItems[0].task === undefined
    ) {
      return err('tq: No task found in task file ' + file.path)
    }

    const contents = await this.app.vault.read(file)
    const lines = contents.split('\n')
    const frontmatter = new Frontmatter(lines)
    const due = frontmatter.get('due')
    const scheduled =frontmatter.get('scheduled')
    const subtasks = await this.getTasksFromFileNames(
      frontmatter.get('subtasks'),
    )
    const parents = await this.getTasksFromFileNames(frontmatter.get('parents'))
    return ok({
      file,
      md: contents,
      frontmatter,
      taskName: Parser.getTaskName(lines, metadata),
      description: Parser.getDescription(lines),
      checked: ['x', 'X'].contains(metadata.listItems[0].task),
      due: due ? window.moment(due).endOf('day') : undefined,
      scheduled: scheduled ? window.moment(scheduled).endOf('day') : undefined,
      subtasks,
      parents,
    })
  }
}
