import { App, Modal } from 'obsidian'
import type { Duration, Moment } from 'moment'

import DatePicker from './UI/pickers/DuePicker.svelte'
import DurationPicker from './UI/pickers/DurationPicker/DurationPicker.svelte'
import type { DurationPickerType } from './Enums/duration-picker-type'
import RepeatPicker from './UI/pickers/RepeatPicker.svelte'
import type TQPlugin from './main'
import type { Task } from './FileInterface'
import { TaskDetails } from './TaskDetails';
import type { TaskDetailsMode } from './Enums/component-context'
import TaskDetailsUI from './UI/TaskDetails/TaskDetailsUI.svelte'
import { on } from 'events'

export class TaskDetailsModal extends Modal {
  private readonly mode: TaskDetailsMode
  private readonly filePath: string
  private readonly plugin: TQPlugin
  constructor(
    plugin: TQPlugin,
    mode: TaskDetailsMode,
  ) {
    super(plugin.app)
    this.plugin = plugin
    this.mode = mode
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
        mode: this.mode
      },
    })
  }

  public onClose = (): void => {
    const { contentEl } = this

    contentEl.empty()
    let tasksNav = this.plugin.taskNav.tasksNavigation
    tasksNav.set([])
  }
}

export class DurationPickerModal extends Modal {
  private readonly title: string
  private readonly duration: Duration
  private readonly set: (duration: Duration) => void
  private readonly type: DurationPickerType
  constructor(
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
  constructor(
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

  constructor(
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
