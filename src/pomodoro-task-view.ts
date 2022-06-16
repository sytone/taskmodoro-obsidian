import { ItemView, WorkspaceLeaf } from 'obsidian'
import { onMount } from 'svelte'
import { VIEW_TYPE_POMODORO_TASK } from './constants'
import SidebarPomodoroTaskView from './ui/SidebarPomodoroTaskView.svelte'
import type TQPlugin from './main'
import type { Task } from './file-interface'
import type { Duration } from 'moment'

export class PomodoroTaskView extends ItemView {
  private readonly plugin: TQPlugin
  public task: Task
  public duration: Duration

  constructor (leaf: WorkspaceLeaf, plugin: TQPlugin) {
    super(leaf)
    this.plugin = plugin
  }

  getViewType (): string {
    return VIEW_TYPE_POMODORO_TASK
  }
  getDisplayText (): string {
    return 'Tq pomodoro'
  }

  getIcon (): string {
    return 'clock'
  }

  async onOpen (): Promise<void> {
    console.log('onOpen task view')
    const content = this.containerEl.children[1]
    content.empty()
    new SidebarPomodoroTaskView({
      target: content,
      props: { plugin: this.plugin, task: this.task, duration: this.duration },
    })
  }

}
