import { Frontmatter } from '../parser'
import TQPlugin from '../main'
import { err, ok, Result } from 'neverthrow'
import { App, TFile } from 'obsidian'
import { Writable, writable, get } from 'svelte/store'
import { TaskDetails } from '../task-details'
import { FilePath, Task, modifyFileContents, FileName } from '../file-interface'
import { Parser } from '../parser'
import moment from 'moment'
import { CachedMetadata } from 'obsidian'

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
    modifyFileContents(td.file, this.app.vault, (lines): boolean => {
      const metadata = this.app.metadataCache.getFileCache(td.file)

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
        console.log(
          'task-loaded:',
          newTask.taskName,
          'scheduled:',
          newTask.scheduled,
        )
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

  // We reload parents data in svelte store to represent change in subtask
  public reloadParent = (file: TFile) => {
    

      let currTask = get(this.tasks)[file.path]
    if (!currTask.parents) return

    for (let parentName of currTask.parents) {

      const now = moment(new Date()).toISOString()
      
      let dir = this.plugin.fileInterface.tasksDir
      let path = `${dir}/${parentName}`
      let parentTask = get(this.tasks)[path]
      this.plugin.fileInterface.updateFMProp(
        parentTask.file,
        now,
        'updated_at',
        false,
        false,
        )
      this.reloadParent(parentTask.file)
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
    const tasksDir = this.plugin.fileInterface.tasksDir
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

  public isTaskAbsent = (metadata: CachedMetadata) => {
    return (
      !metadata.listItems ||
      metadata.listItems.length < 1 ||
      metadata.listItems[0].task === undefined
    )
  }
  private readonly loadTask = async (
    file: TFile,
  ): Promise<Result<Task, string>> => {
    const metadata = this.app.metadataCache.getFileCache(file)
    if (this.isTaskAbsent(metadata)) {
      return err('tq: No task found in task file ' + file.path)
    }

    const contents = await this.app.vault.read(file)
    const lines = contents.split('\n')
    const frontmatter = new Frontmatter(lines)
    const due = frontmatter.get('due')
    const scheduled = frontmatter.get('scheduled')
    const subtasks = await this.getTasksFromFileNames(
      frontmatter.get('subtasks'),
    )
    const parents = frontmatter.get('parents')
    return ok({
      file,
      md: contents,
      frontmatter,
      taskName: Parser.getTaskName(lines, metadata),
      description: Parser.getDescription(lines),
      completed: Parser.isTaskCompleted(metadata),
      due: due ? window.moment(due).endOf('day') : undefined,
      scheduled: scheduled ? window.moment(scheduled).endOf('day') : undefined,
      subtasks,
      parents,
    })
  }
}
