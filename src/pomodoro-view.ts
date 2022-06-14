import { ItemView, WorkspaceLeaf } from 'obsidian'
import { onMount } from 'svelte'
import { VIEW_TYPE_POMODORO } from './constants'
import PomodoroTimer from './ui/PomodoroTimer.svelte'
import TQPlugin from './main'
export class PomodoroView extends ItemView {
  private readonly plugin: TQPlugin
  constructor (leaf: WorkspaceLeaf, plugin: TQPlugin) {
    super(leaf)
    this.plugin = plugin
  }
  getViewType (): string {
    return VIEW_TYPE_POMODORO
  }
  getDisplayText (): string {
    return 'Tq pomodoro'
  }

  getIcon (): string {
    return 'clock'
  }

  async onOpen (): Promise<void> {
    const content = this.containerEl.children[1]
    new PomodoroTimer({ target: content })
  }
}
