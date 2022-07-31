import type { FileName, Task } from './FileInterface'
import { FilePath as FileName } from './FileInterface';
import { durationFormat, formatDate } from './Helpers/Helpers'
import type TQPlugin from './main'
import { toInteger } from 'lodash'
import type { Duration } from 'moment'
import moment from 'moment'
import MomentDurationSetup from 'moment-duration-format'
import type { TFile } from 'obsidian'
MomentDurationSetup(moment)

export class TaskDetails {
  public plugin: TQPlugin
  public file: TFile
  public tagsCache: string[]
  public taskName = ''
  public description = ''
  public completed = false
  public recurringConfig = ''
  public due = ''
  public scheduled = ''
  public tags = ''
  public pomodoroLenght = moment.duration(30, 'minutes')
  public spentWorktime = moment.duration(0, 'seconds')
  public dailyScheduledWorktime: Duration = null
  public estWorktime: Duration = null
  public subtasks: TaskDetails[] = []
  public parents: FileName[] = []

  // Callback for closing TaskDetailsModal
  public close: () => void

  public getWorktimeStr(worktime: Duration): string {
    const estWorktimeStr =
      !worktime || worktime.asMinutes() === 0
        ? 'None'
        : `${durationFormat(worktime)}`
    return estWorktimeStr
  }

  constructor(
    plugin: TQPlugin,
    task: Task = undefined,
    close: () => void = undefined
  ) {
    this.plugin = plugin
    this.tagsCache = Object.keys((plugin.app.metadataCache as any).getTags())
    if (close) {
      this.close = close
    }
    if (task) {
      const fm = task.frontmatter
      this.due = formatDate(task.due)
      this.recurringConfig = fm.get('repeat')
      this.scheduled = formatDate(task.scheduled)
      this.taskName = task.taskName
      this.description = task.description
      this.completed = task.completed
      this.file = task.file
      const pomoLen = toInteger(fm.get('pomodoro_length')?.minutes) || 30
      this.pomodoroLenght = moment.duration(pomoLen, 'minutes')
      const now = moment().format('YYYY-MM-DD');
      const dailyScheduledWorktime = fm.get('daily_scheduled_worktime')
      if (dailyScheduledWorktime && dailyScheduledWorktime[now]) {
        this.dailyScheduledWorktime = moment.duration(dailyScheduledWorktime[now], 'minutes')
      }
      const estWorklength = fm.get('estimated_worktime')?.minutes

      if (estWorklength) {
        this.estWorktime = moment.duration(estWorklength, 'minutes')
      }
      const tags: string[] = fm.get('tags')

      if (tags) {
        this.tags += tags.join(' ')
      }

      const ta: [{ start: string; end: string }] = fm.get('timer_activity')

      if (ta) {
        this.spentWorktime = moment.duration()
        ta.forEach(a => {
          const diff = moment(a.end).diff(moment(a.start))
          this.spentWorktime.add(diff, 'milliseconds')
        })
      }
      const subtasks: Task[] = task.subtasks

      for (const subtask of subtasks) {
        const subtd = new TaskDetails(this.plugin, subtask, close)
        this.subtasks.push(subtd)
      }

      this.parents = task.parents

    }
  }

  public get cleanedTags(): string[] {
    return this.cleanTags(this.tags)
  }

  // Seperate method to leverage svelte reactivity
  public cleanTags(tags: string): string[] {
    return tags
      .split(/[ ]+/)
      .filter(x => x !== '')
  }

  public create = async (): Promise<string> => {
    const fileName = this.plugin.fileInterface.storeNestedTasks(this)

    if (this.close) {
      this.close()
    }
    return fileName
  }
}
