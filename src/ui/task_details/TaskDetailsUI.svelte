<script lang="ts">
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import TaskDetailsSidebar from './TaskDetailsSidebar.svelte';
  import type TQPlugin from '../../main';
  import type { TaskDetailsMode } from '../../enums/component-context';
  import type { Task } from '../../file-interface';
  import { TaskDetails } from '../../task-details';

  export let close: () => void;
  export let mode: TaskDetailsMode;
  export let plugin: TQPlugin;
  // export let td: TaskDetails;
  export let filePath: string;
  let td: TaskDetails;
  let tasks = plugin.taskCache.tasks;
  $: {
    td = getTd($tasks);
  }

  const getTd = (tasks: Record<string, Task>) => {
    let _td: TaskDetails;
    if (filePath) {
      _td = new TaskDetails(plugin, tasks[filePath]);
    } else {
      _td = new TaskDetails(plugin);
    }
    console.log('td.subtasks: ', _td.subtasks);
    _td.close = close;
    return _td;
  };

</script>

<TaskDetailsMainPanel {mode} bind:td />
<TaskDetailsSidebar {mode} bind:td />

<style>
</style>
