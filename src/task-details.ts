import TQPlugin from './main'
import { Task } from './file-interface'
import { TFile } from 'obsidian'
import { formatDate } from './util'
import moment from 'moment'
import MomentDurationSetup from 'moment-duration-format'
import { toInteger } from 'lodash'
import { Duration } from 'moment'
MomentDurationSetup(moment)

export class TimeDuration {
  hours: number
  minutes: number

  constructor (duration: Duration) {
    this.hours = duration.days()*24 + duration.hours()
    this.minutes = duration.minutes()
  }

  public toString = (options: string[]): string => {
    let str = ''
    if (options.includes('hours')) {
      str += `${this.hours}h `
    }

    if (options.includes('minutes')) {
      str += `${this.minutes}min `
    }
    return str
  }
}

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
  public estWorktime = moment.duration()
  public close: () => void

  constructor (plugin: TQPlugin, task: Task | undefined = undefined) {
    this.plugin = plugin
    this.tagsCache = Object.keys((plugin.app.metadataCache as any).getTags())
    if (task) {
      this.due = formatDate(task.due)
      this.repeatConfig = task.frontmatter.get('repeat')
      this.scheduled = formatDate(task.scheduled)
      this.taskName = task.taskName
      this.description = task.description
      this.completed = task.frontmatter.get('completed')
      this.file = task.file
      const pomoLen = toInteger(task.frontmatter.get('pomodoro_length')) || 30
      this.pomoDuration = moment.duration(pomoLen, 'minutes')
      let ewt = task.frontmatter.get('estimated_worktime')

      if (ewt) {
        this.estWorktime.add(ewt.hours, 'hours')
        this.estWorktime.add(ewt.minutes, 'minutes')
      }

      // this.overdue = (!task.checked && task.due?.isBefore(window.moment())) || false;
    }
  }

  onCreate = () => {
    const cleanedTags = this.tags
      .split(/[, ]/)
      .filter(x => x !== '')
      .map(tag => tag.trim().replace('#', ''))

    const tmD = new TimeDuration(this.estWorktime)

    this.plugin.fileInterface.storeNewTask(
      this.taskName,
      this.description,
      this.pomoDuration.asMinutes(),
      tmD,
      this.due,
      this.scheduled,
      this.repeats ? this.repeatConfig : '',
      cleanedTags,
    )

    this.close()
  }
}
