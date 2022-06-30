import {
  Frontmatter,
  getDescription,
  setCompletedDate,
  setDueDateToNext,
} from './parser'
import TQPlugin from './main'
import { Moment } from 'moment'
import { err, ok, Result } from 'neverthrow'
import { App, Notice, TAbstractFile, TFile, Vault } from 'obsidian'
import { Writable, writable } from 'svelte/store'
import { Duration } from 'moment'
import { TaskDetails } from './task-details'

export interface Task {
  file: TFile
  md: string
  frontmatter: Frontmatter
  taskName: string
  description: string
  checked: boolean
  due: Moment | undefined
  scheduled: Moment | undefined
  subtasks: Task[]
}

export const CalcTaskScore = (task: Task): number => {
  // Factors:
  // - Days overdue (current date - due date)
  // - Days until due (due date - current date)
  // - Priority
  // - Urgency
  // - How long ago it was created (more recent task are more important)

  let score = 1
  if (task.checked) {
    return score
  }

  if (task.due) {
    const untilDue = task.due.diff(window.moment(), 'days')
    if (untilDue > 0) {
      // Upcoming tasks use 1/(days until due)
      score *= 1 / untilDue
    } else {
      // negative value indicates amount over-due
      // Overdue tasks use (days overdue)/2
      score *= untilDue / 2
    }
  }

  // if (task.urgent) {
  //   score *= 2
  // }
  // if (task.important) {
  //   score *= 1.5
  // }

  return score
}

export type FilePath = string

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

  public readonly handleTaskDeleted = (path: string): void => {
    this.tasks.update(
      (tasks): Record<FilePath, Task> => {
        delete tasks[path]
        return tasks
      },
    )
  }

  private readonly getTasksFromFileNames =  async (fileNames: string[]): Promise<Task[]>=>{
    if(!fileNames) return []
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
      !metadata.listItems ||
      metadata.listItems.length < 1 ||
      metadata.listItems[0].task === undefined
    ) {
      return err('tq: No task found in task file ' + file.path)
    }

    
    const contents = await this.app.vault.read(file)
    const lines = contents.split('\n')
    const taskNameLineIdx = metadata.listItems[0].position.start.line
    const frontmatter = new Frontmatter(lines)
    const due = frontmatter.get('due')
    const scheduled = frontmatter.get('scheduled')
    const subtasks = await this.getTasksFromFileNames(frontmatter.get('subtasks'))
    return ok({
      file,
      md: contents,
      frontmatter,
      taskName: lines[taskNameLineIdx].replace(/- \[[xX ]\]/, ''),
      description: getDescription(lines),
      checked: ['x', 'X'].contains(metadata.listItems[0].task),
      due: due ? window.moment(due).endOf('day') : undefined,
      scheduled: scheduled ? window.moment(scheduled).endOf('day') : undefined,
      subtasks
    })
  }
}

export class FileInterface {
  private readonly plugin: TQPlugin
  private readonly app: App

  public static readonly descStartToken = '<!---DESC_START--->'
  public static readonly descEndToken = '<!---DESC_END--->'

  public constructor (plugin: TQPlugin, app: App) {
    this.plugin = plugin
    this.app = app
  }

  public readonly handleTaskModified = async (
    afile: TAbstractFile,
  ): Promise<void> => {
    const tfile = this.app.metadataCache.getFirstLinkpathDest(afile.path, '/')
    if (!tfile) {
      console.debug('tq: Unable to find TFile for TAFile: ' + afile.path)
      return
    }

    return withFileContents(tfile, this.app.vault, (lines: string[]): boolean =>
      this.processRepeating(tfile.path, lines),
    )
  }

  public readonly setTimerActivity = (
    file: TFile,
    vault: Vault,
    start: Moment,
    end: Moment,
  ) => {
    withFileContents(file, vault, (lines: string[]): boolean => {
      let frontmatter: Frontmatter

      try {
        frontmatter = new Frontmatter(lines)
      } catch (error) {
        console.debug(error)
        return false
      }

      const format = 'YYYY-MM-DD H:m:s'
      const startStr = start.format(format)
      const endStr = end.format(format)
      const activity = { start: startStr, end: endStr }
      if (!frontmatter.contains('timer_activity')) {
        frontmatter.set('timer_activity', [activity])
      } else {
        const ta = frontmatter.get('timer_activity')
        ta.push(activity)
      }

      frontmatter.overwrite()

      return true
    })
  }

  public readonly updateFMProp = async (
    file: TFile,
    vault: Vault,
    value: Moment | String | Number | Object,
    propName: string,
  ): Promise<void> =>
    withFileContents(file, vault, (lines: string[]): boolean => {
      let frontmatter: Frontmatter
      try {
        frontmatter = new Frontmatter(lines)
      } catch (error) {
        console.debug(error)
        return false
      }

      frontmatter.set(propName, value)
      frontmatter.overwrite()
      return true
    })

  /**
   * processRepeating checks the provided lines to see if they describe a
   * repeating task and whether that task is checked. If so, the task is
   * unchecked, the due date updated according to the repeat config, and the
   * current date added to the completed list in the frontmatter.
   * */
  public readonly processRepeating = (
    path: string,
    lines: string[],
  ): boolean => {
    let frontmatter: Frontmatter
    try {
      frontmatter = new Frontmatter(lines)
    } catch (error) {
      console.debug(error)
      return false
    }

    if (!frontmatter.contains('repeat')) {
      // This is not a repeating task, no work to do
      return false
    }

    // Look for the task and check status
    const taskLine = lines.findIndex(line => /^- \[[xX]\]/.test(line))
    if (taskLine < 0) {
      // Completed task not found, skip
      return false
    }

    console.debug('tq: Reloading repeating task in ' + path)

    // Uncheck the task
    lines[taskLine] = lines[taskLine].replace(/\[[xX]\]/, '[ ]')

    setCompletedDate(frontmatter)
    setDueDateToNext(frontmatter)

    frontmatter.overwrite()

    new Notice('New task repetition created')
    return true
  }

  public readonly storeNestedTasks = async (
    td: TaskDetails,
  ): Promise<string> => {
    let subtasksFileNames: string[] = []
    for (let subtask of td.subtasks) {
      let _filename = await this.storeNestedTasks(subtask)
      subtasksFileNames.push(_filename)
    }

    let fileName = this.storeNewTask(
      td.taskName,
      td.description,
      td.pomoDuration,
      td.estWorktime,
      td.due,
      td.scheduled,
      td.repeatConfig,
      td.cleanedTags,
      subtasksFileNames,
    )

    return await fileName
  }

  public readonly storeNewTask = async (
    taskName: string,
    description: string,
    pomoDuration: Duration,
    estWorktime: Duration,
    due: string,
    scheduled: string,
    repeat: string,
    tags: string[],
    subtasksNames: string[],
  ): Promise<string> => {
    const tasksDir = this.plugin.settings.TasksDir
    const newHash = this.createTaskBlockHash()
    const fileName = `${tasksDir}/${newHash}.md`
    const data = this.formatNewTask(
      taskName,
      description,
      pomoDuration,
      estWorktime,
      due,
      scheduled,
      repeat,
      tags,
      subtasksNames,
    )

    console.debug('tq: Creating a new task in ' + fileName)
    console.debug(data)

    if (!(await this.app.vault.adapter.exists(tasksDir))) {
      await this.app.vault.createFolder(tasksDir)
    }

    await this.app.vault.create(fileName, data)

    return `${newHash}.md`
  }

  /**
   * @return YAML frontmatter
   */
  private readonly formatNewTask = (
    taskName: string,
    description: string,
    pomoDuration: Duration,
    estWorktime: Duration,
    due: string,
    scheduled: string,
    repeat: string,
    tags: string[],
    subtasksNames: string[],
  ): string => {
    const frontMatter = []

    if (pomoDuration) {
      let pomoLen = `  minutes: ${pomoDuration.asMinutes()}`
      frontMatter.push(`pomodoro_length:\n${pomoLen}`)
    }

    if (estWorktime) {
      let fmM = `  minutes: ${estWorktime.asMinutes()}`
      frontMatter.push(`estimated_worktime:\n${fmM}`)
    }

    if (due) {
      frontMatter.push(`due: '${due}'`)
    }

    if (scheduled) {
      frontMatter.push(`scheduled: '${scheduled}'`)
    }

    if (repeat) {
      frontMatter.push('repeat: ' + repeat)
    }

    if (tags && tags.length > 0 && tags[0].length > 0) {
      frontMatter.push(`tags: [ ${tags.join(', ')} ]`)
    }

    if (subtasksNames.length !== 0) {
      let fm = 'subtasks: \n'
      for (let name of subtasksNames) {
        fm += `  - ${name}\n`
      }
      frontMatter.push(fm)
    }

    const contents = []
    if (frontMatter.length > 0) {
      contents.push('---')
      contents.push(...frontMatter)
      contents.push('---')
      contents.push('')
    }
    contents.push('## Task')
    contents.push('- [ ] ' + taskName)
    contents.push(
      `\n ${FileInterface.descStartToken} \n ${description} \n ${FileInterface.descEndToken}`,
    )

    return contents.join('\n')
  }

  private readonly createTaskBlockHash = (): string => {
    let result = 'task-'
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}

/**
 * Read the file contents and pass to the provided function as a list of lines.
 * If the provided function returns true, write the array back to the file.
 * NOTE: If useCache is true, the fn is not allowed to update the file!
 */
const withFileContents = async (
  file: TFile,
  vault: Vault,
  fn: (lines: string[]) => boolean,
): Promise<void> => {
  const fileContents = (await vault.read(file)) || ''
  const lines = fileContents.split('\n')

  const updated = fn(lines)
  if (updated) {
    return vault.modify(file, lines.join('\n'))
  }
}
