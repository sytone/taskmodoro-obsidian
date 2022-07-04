<script lang="ts">
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import TaskDetailsSidebar from './TaskDetailsSidebar.svelte';
  import type TQPlugin from '../../main';
  import type { TaskDetailsMode } from '../../enums/component-context';
  import type { FilePath, Task } from '../../file-interface';
  import { TaskDetails } from '../../task-details';
import type { Writable } from 'svelte/store';

  export let close: () => void;
  export let mode: TaskDetailsMode;
  export let plugin: TQPlugin;
  let td: TaskDetails;
  let tasksCache: Writable<Record<string, Task>> = plugin.taskCache.tasks;
  let tasksNav: Writable<FilePath[]> = plugin.taskNav.tasksNavigation;

  $: {
    
    td = getTd($tasksCache, $tasksNav);
  }

  const getTd = (tasks: Record<string, Task>, tasksNav: FilePath[]) => {
    let _td: TaskDetails;
    let currTask: FilePath = tasksNav.last();
    if (currTask) {
      _td = new TaskDetails(plugin, tasks[currTask]);
    } else {
      _td = new TaskDetails(plugin);
    }
    _td.close = close;
    return _td;
  };
</script>

<TaskDetailsMainPanel {mode} bind:td />
<TaskDetailsSidebar {mode} bind:td />

<style>
</style>
