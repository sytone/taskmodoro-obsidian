import type TQPlugin from './main'
import TaskDetailsUI from './ui/task_details/TaskDetailsUI.svelte'
import DatePicker from './ui/pickers/DuePicker.svelte'
import RepeatPicker from './ui/pickers/RepeatPicker.svelte'
import type { Duration, Moment } from 'moment'
import { App, Modal } from 'obsidian'
import type { TaskDetailsMode } from './enums/component-context'
import type { Task } from './file-interface'
import DurationPicker from './ui/pickers/duration_picker/DurationPicker.svelte'
import { on } from 'events'
export class TaskDetailsModal extends Modal {
  private readonly plugin: TQPlugin
  private readonly mode: TaskDetailsMode
  private readonly task: Task | undefined

  constructor (
    plugin: TQPlugin,
    mode: TaskDetailsMode,
    task: Task | undefined = undefined,
  ) {
    super(plugin.app)
    this.plugin = plugin
    this.mode = mode
    this.task = task
  }

  public onOpen = (): void => {
    const { contentEl, modalEl } = this
    modalEl.addClasses(['tq-modal', 'tq'])
    contentEl.addClass('tq-modal-content')
    new TaskDetailsUI({
      target: contentEl,
      props: {
        close: () => this.close(),
        plugin: this.plugin,
        mode: this.mode,
        task: this.task,
      },
    })
  }

  public onClose = (): void => {
    const { contentEl } = this
    contentEl.empty()
  }
}

export class DurationPickerModal extends Modal {
  private readonly title: string
  private readonly duration: Duration
  private readonly set: (duration: Duration) => void
  constructor (
    app: App,
    title: string,
    duration: Duration,
    set: (duration: Duration) => void,
  ) {
    console.log(app)
    super(app)

    this.title = title
    this.duration = duration
    this.set=set
  }

  public onOpen = (): void => {
    const { titleEl, contentEl } = this
    titleEl.setText(this.title)
    new DurationPicker({
      target: contentEl,
      props: {
        close: () => this.close(),
        set: this.set,
        duration: this.duration,
      },
    })
  }

  public onClose = (): void => {
    const { titleEl, contentEl } = this
    titleEl.empty()
    contentEl.empty()

  }
}

export class DatePickerModal extends Modal {
  private readonly startDate: Moment
  private readonly set: (date: Moment) => void
  private readonly title: string
  constructor (
    app: App,
    startDate: Moment,
    title: string,
    set: (date: Moment) => void,
  ) {
    super(app)

    this.startDate = startDate
    this.set = set
    this.title = title
  }

  public onOpen = (): void => {
    const { titleEl, contentEl } = this
    titleEl.setText(this.title)
    new DatePicker({
      target: contentEl,
      props: {
        close: () => this.close(),
        set: this.set,
        startDate: this.startDate,
      },
    })
  }

  public onClose = (): void => {
    const { contentEl } = this
    contentEl.empty()
  }
}

export class RepeatPickerModal extends Modal {
  private readonly repeatConfig: string
  private readonly set: (repeatConfig: string) => void

  constructor (
    app: App,
    repeatConfig: string,
    set: (repeatConfig: string) => void,
  ) {
    super(app)

    this.repeatConfig = repeatConfig
    this.set = set
  }

  public onOpen = (): void => {
    const { titleEl, contentEl } = this
    titleEl.setText('Set Repeat Config')
    new RepeatPicker({
      target: contentEl,
      props: {
        close: () => this.close(),
        set: this.set,
        repeatConfig: this.repeatConfig,
        repeats: this.repeatConfig !== 'none',
      },
    })
  }

  public onClose = (): void => {
    const { contentEl } = this
    contentEl.empty()
  }
}
