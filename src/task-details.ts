import type TQPlugin from './main'
import type { Task } from './file-interface'
import { formatDate } from './util'
import moment from 'moment'
import MomentDurationSetup from 'moment-duration-format';
MomentDurationSetup(moment);
export default class TaskDetails {
  public plugin: TQPlugin
  public tagsCache: string[]
  public taskName = ''
  public description = ''
  public repeats = false
  public completed = false
  public repeatConfig = ''
  public due = ''
  public scheduled = ''
  public tags = ''
  public pomodoroLength = moment.duration(30,'minutes')
  public close: () => void

  constructor (plugin: TQPlugin, task: Task | undefined = undefined) {
    this.plugin = plugin
    this.tagsCache = Object.keys((plugin.app.metadataCache as any).getTags())
    if (task) {
      this.due = formatDate(task.due)
      this.repeatConfig = task.frontmatter.get('repeat')
      this.scheduled = formatDate(task.scheduled)
      this.taskName= task.taskName
      this.description = task.description
      this.completed = task.frontmatter.get('completed')

      let pomoLen = task.frontmatter.get('pomodoro_length');
      this.pomodoroLength = pomoLen ? pomoLen : this.pomodoroLength
    }
  }

  onCreate = () => {
    const cleanedTags = this.tags
      .split(/[, ]/)
      .filter(x => x !== '')
      .map(tag => tag.trim().replace('#', ''))

    this.plugin.fileInterface.storeNewTask(
      this.taskName,
      this.description,
      this.due,
      this.scheduled,
      this.repeats ? this.repeatConfig : '',
      cleanedTags,
    )
    this.close()
  }
}
