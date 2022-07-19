/* eslint-disable no-param-reassign */
import { App, Notice, TAbstractFile, TFile, Vault } from 'obsidian'
import type { Duration, Moment } from 'moment'
import {
  Frontmatter,
  Parser,
  setCompletedDate,
  setDueDateToNext,
} from './parser'

import type TQPlugin from './main'
import type { TaskDetails } from './task-details'
import { getTextAbv } from './helpers/util';
import { isArrayLike } from 'lodash'
import moment from 'moment'

export interface Task {
  file: TFile
  md: string
  frontmatter: Frontmatter
  taskName: string
  description: string
  completed: boolean
  due: Moment | undefined
  scheduled: Moment | undefined
  subtasks: Task[]
  parents: FileName[]
}

export const CalcTaskScore = (task: Task): number => {
  // Factors:
  // - Days overdue (current date - due date)
  // - Days until due (due date - current date)
  // - Priority
  // - Urgency
  // - How long ago it was created (more recent task are more important)

  let score = 1
  if (task.completed) {
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
export type FileName = string
export class FileInterface {
  public static readonly descStartToken = '<!---DESC_START--->'
  public static readonly descEndToken = '<!---DESC_END--->'
  public readonly tasksDir: string
  private readonly plugin: TQPlugin
  private readonly app: App

  public constructor (plugin: TQPlugin, app: App) {
    this.plugin = plugin
    this.app = app
    this.tasksDir = this.plugin.settings.TasksDir
  }

  public readonly handleTaskModified = async (
    afile: TAbstractFile,
  ): Promise<void> => {
    const tfile = this.app.metadataCache.getFirstLinkpathDest(afile.path, '/')
    if (!tfile) {
      console.debug('tq: Unable to find TFile for TAFile: ' + afile.path)
      return
    }

    return modifyFileContents(
      tfile,
      this.app.vault,
      (lines: string[]): boolean => this.processRepeating(tfile.path, lines),
    )
  }

  public readonly setTimerActivity = (
    file: TFile,
    start: Moment,
    end: Moment,
  ): void => {
    modifyFileContents(file, this.app.vault, (lines: string[]): boolean => {
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
    value: Moment | string | string[] | Number | Object,
    propName: string,
    appendArr = false,
    reloadParent = true
  ): Promise<void> =>
    modifyFileContents(file, this.app.vault, (lines: string[]): boolean => {
      let frontmatter: Frontmatter
      try {
        frontmatter = new Frontmatter(lines)
      } catch (error) {
        console.debug(error)
        return false
      }

      if (appendArr) {
        value = this.appendValue(propName,value,frontmatter)
      }

      frontmatter.set(propName, value)
      frontmatter.overwrite()
      return true
    })


  public readonly updateTaskName = async (file: TFile, taskName: string): Promise<void> => {
    const metadata = this.app.metadataCache.getFileCache(file)
    let content = await this.app.vault.read(file)
    let contentLines = content.split('\n')
    const taskNameLines = taskName.split('\n')
    contentLines = Parser.replaceTaskName(contentLines, taskNameLines, metadata)
    content = contentLines.join('\n')
    this.app.vault.modify(file, content)
  }

  public readonly updateDescription = async (
    file: TFile,
    description: string,
  ): Promise<void> => {
    let content = await this.app.vault.read(file)
    let contentLines = content.split('\n')
    const descLines = description.split('\n')
    contentLines = Parser.replaceDescription(contentLines, descLines)
    content = contentLines.join('\n')
    this.app.vault.modify(file, content)
  }

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
    const subtasksFileNames: string[] = []
    
    // First we store subtasks recursively and get their file names 
    for (const subtask of td.subtasks) {
      const fileName = await this.storeNestedTasks(subtask)
      subtasksFileNames.push(fileName)
    }

    // Then we store current task
    const currTaskPath = await this.storeNewTask(
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

    // Update all subtasks frontmatter `parents` property to current task
    for (const fileName of subtasksFileNames) {
      const subtaskFile = this.app.metadataCache.getFirstLinkpathDest(
        `${this.tasksDir}/${fileName}`,
        '/',
      )
      this.updateFMProp(subtaskFile, currTaskPath, 'parents', true,false)
    }

    return currTaskPath
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
    subtasksNames: FileName[],
  ): Promise<string> => {
    const hash = this.createTaskBlockHash()
    const fileName = `${hash}.md`
    const filePath = `${this.tasksDir}/${fileName}`
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

    console.debug('tq: Creating a new task in ' + filePath)
    console.debug(data)

    if (!(await this.app.vault.adapter.exists(this.tasksDir))) {
      await this.app.vault.createFolder(this.tasksDir)
    }
    await this.app.vault.create(filePath, data)

    return fileName
  }

  private readonly appendValue = (propName: string,value: any,frontmatter:Frontmatter): any=> {
    const fmArr = frontmatter.get(propName)
    if (!fmArr) {
      value = [value]
    }
    if (fmArr && isArrayLike(fmArr)) {
      value = [...fmArr, value]
    }
    return value
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



    const createdAt = moment(new Date()).toISOString()
    frontMatter.push(`created_at: ${createdAt}`)

    if (pomoDuration) {
      const pomoLen = `  minutes: ${pomoDuration.asMinutes()}`
      frontMatter.push(`pomodoro_length:\n${pomoLen}`)
    }

    if (estWorktime) {
      const fmM = `  minutes: ${estWorktime.asMinutes()}`
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
      let tagsFm = ''
      for (const tag of tags) {
        tagsFm += `\n  - '${tag}'`
      }
      frontMatter.push(`tags:${tagsFm}`)
    }

    if (subtasksNames.length !== 0) {
      let subtasks = ''
      for (const name of subtasksNames) {
        subtasks += `\n  - ${name}`
      }
      frontMatter.push(`subtasks:${subtasks}`)
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
    let hash = 'task-'
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < 6; i++) {
      hash += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return hash
  }
}

/**
 * Read the file contents and pass to the provided function as a list of lines.
 * If the provided function returns true, write the array back to the file.
 * NOTE: If useCache is true, the fn is not allowed to update the file!
 */
export const modifyFileContents = async (
  file: TFile,
  vault: Vault,
  modificator: (lines: string[]) => boolean,
): Promise<void> => {
  const fileContents = (await vault.read(file)) || ''
  const lines = fileContents.split('\n')

  const modified = modificator(lines)
  if (modified) {
    return vault.modify(file, lines.join('\n'))
  }
}
