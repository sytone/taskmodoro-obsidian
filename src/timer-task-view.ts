import { ItemView, WorkspaceLeaf } from 'obsidian'
import { onMount } from 'svelte'
import { VIEW_TYPE_POMODORO_TASK } from './helpers/constants'
import SidebarTimerTaskView from './ui/sidebar_timer/SidebarTimerTaskView.svelte'
import type TQPlugin from './main'
import type { Task } from './file-interface'
import type { Duration } from 'moment'
import type { TaskDetails } from './task-details';

export class TimerTaskView extends ItemView {
  private readonly plugin: TQPlugin
  public td: TaskDetails

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
    new SidebarTimerTaskView({
      target: content,
      props: { plugin: this.plugin, td: this.td},
    })
  }

}
