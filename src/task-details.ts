import TQPlugin from './main'
import { Task } from './file-interface'
import { TFile } from 'obsidian'
import { formatDate, durationFormat_hm } from './util';
import moment from 'moment'
import MomentDurationSetup from 'moment-duration-format'
import { toInteger } from 'lodash'
import { Duration } from 'moment'
MomentDurationSetup(moment)

export class TaskDetails {
  public plugin: TQPlugin
  public file: TFile
  public tagsCache: string[]
  public taskName = ''
  public description = ''
  public repeats = false
  public completed = false
  public repeatConfig = ''
  public due = ''
  public scheduled = ''
  public tags = ''
  public pomoDuration = moment.duration(30, 'minutes')
  public estWorktime: Duration
  public spentWorktime: Duration
  public subtasks: TaskDetails[] = []
  public close: () => void

  public get cleanedTags (): string[] {
    return this.tags
    .split(/[, ]/)
    .filter(x => x !== '')
    .map(tag => tag.trim().replace('#', ''))
  }

  public get estWorktimeStr (): string {
    let estWorktimeStr =
      !this.estWorktime || this.estWorktime.asMinutes() === 0
        ? 'None'
        : `${durationFormat_hm(this.estWorktime)}`
    return estWorktimeStr
  }

  constructor (plugin: TQPlugin, task: Task | undefined = undefined) {
    this.plugin = plugin
    this.tagsCache = Object.keys((plugin.app.metadataCache as any).getTags())
    if (task) {
      let fm = task.frontmatter
      this.due = formatDate(task.due)
      this.repeatConfig = fm.get('repeat')
      this.scheduled = formatDate(task.scheduled)
      this.taskName = task.taskName
      this.description = task.description
      this.completed = fm.get('completed')
      this.file = task.file

      const pomoLen = toInteger(fm.get('pomodoro_length')?.minutes) || 30
      this.pomoDuration = moment.duration(pomoLen, 'minutes')

      let estWorklength = fm.get('estimated_worktime')?.minutes

      if (estWorklength) {
        this.estWorktime = moment.duration(estWorklength, 'minutes')
      }

      let ta: [{ start: string; end: string }] = fm.get('timer_activity')

      if (ta) {
        this.spentWorktime = moment.duration()
        ta.forEach(a => {
          let diff = moment(a.end).diff(moment(a.start))
          this.spentWorktime.add(diff, 'milliseconds')
        })
      }
      const subtasks: Task[] = task.subtasks
      
      for(let subtask of subtasks){
        this.subtasks.push(new TaskDetails(this.plugin,subtask))
      }
      // this.overdue = (!task.checked && task.due?.isBefore(window.moment())) || false;
    }
  }

  onCreate = () => {
    this.plugin.fileInterface.storeNestedTasks(
      this
    )
    this.close()
  }
}
