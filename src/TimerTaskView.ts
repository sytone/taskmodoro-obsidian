import { ItemView, WorkspaceLeaf } from 'obsidian';
import SidebarTimerTaskView from './UI/SidebarTimer/SidebarTimerTaskView.svelte';
import type TQPlugin from './main';
import type { TaskDetails } from './TaskDetails';
import { VIEW_TYPE_POMODORO_TASK } from './Helpers/Constants';

export class TimerTaskView extends ItemView {
    private readonly plugin: TQPlugin;
    public td: TaskDetails;

    constructor(leaf: WorkspaceLeaf, plugin: TQPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_POMODORO_TASK;
    }
    getDisplayText(): string {
        return 'Tq pomodoro';
    }

    getIcon(): string {
        return 'clock';
    }

    async onOpen(): Promise<void> {
        const content = this.containerEl.children[1];
        content.empty();
        new SidebarTimerTaskView({
            target: content,
            props: { plugin: this.plugin, td: this.td },
        });
    }
}
