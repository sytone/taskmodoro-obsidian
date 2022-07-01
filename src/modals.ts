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
import type { DurationPickerType } from './enums/duration-picker-type'
import { TaskDetails } from './task-details';

export class TaskDetailsModal extends Modal {
  private readonly mode: TaskDetailsMode
  private readonly filePath: string
  private readonly plugin: TQPlugin
  constructor (
    plugin: TQPlugin,
    mode: TaskDetailsMode,
    filePath: string = undefined,
  ) {
    super(plugin.app)
    this.plugin=plugin
    this.mode = mode
    this.filePath=filePath
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
        filePath: this.filePath
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
  private readonly type: DurationPickerType
  constructor (
    app: App,
    title: string,
    duration: Duration,
    type: DurationPickerType,
    set: (duration: Duration) => void,
  ) {
    super(app)
    this.title = title
    this.duration = duration
    this.type = type
    this.set = set
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
        type: this.type
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
