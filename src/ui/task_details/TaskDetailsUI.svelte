<script lang="ts">
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import TaskDetailsSidebar from './TaskDetailsSidebar.svelte';
import type TQPlugin from '../../main';
import type { TaskDetailsMode } from '../../enums/component-context';
import type { Task } from '../../file-interface';
import {TaskDetails} from '../../task-details';

  export let close: () => void;
  export let plugin: TQPlugin;
  export let mode: TaskDetailsMode;
  export let task: Task | undefined;
  let td = new TaskDetails(plugin, task);
  td.close = close;

  // TODO: Allow setting arbitrary fields in this form, configured in settings
</script>

<TaskDetailsMainPanel {mode} bind:td />
<TaskDetailsSidebar {mode} bind:td />

<style>
</style>
