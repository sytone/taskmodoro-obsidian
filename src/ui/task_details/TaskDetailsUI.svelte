<script lang="ts">
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import TaskDetailsSidebar from './TaskDetailsSidebar.svelte';
  import type TQPlugin from '../../main';
  import type { FilePath, Task } from '../../file-interface';
  import { TaskDetails } from '../../task-details';
  import type { Writable } from 'svelte/store';
  import { TaskDetailsMode } from '../../enums/component-context';

  export let close: () => void;
  export let mode: TaskDetailsMode;
  export let plugin: TQPlugin;
  let td: TaskDetails;
  let tasksCache: Writable<Record<string, Task>> = plugin.taskCache.tasks;
  let tasksNav: Writable<FilePath[]> = plugin.taskNav.tasksNavigation;

  $: {
    getTaskNavTd($tasksCache, $tasksNav);
  }

  // Either gets last navigation task or a new one is created
  const getTaskNavTd = (tasks: Record<string, Task>, tasksNav: FilePath[]) => {
    console.log('getTaskFromStores')
    // let _td: TaskDetails;
    let currTask: FilePath = tasksNav.last();

    if (currTask) {
      td = new TaskDetails(plugin, tasks[currTask]);
    } else {
      td = new TaskDetails(plugin);
    }
    td.close = close;
    // return _td;
  };

  // figure out how to prevent this method from being triggered
  // Two unique indicators - mode and empty task nav
</script>

{#if mode === TaskDetailsMode.Create}
  <TaskDetailsMainPanel {mode} bind:td />
  <TaskDetailsSidebar {mode} bind:td />
  <!-- Changes in update mode are made by modifying file contents
    which trigger a change in svelte store that rerenders dependant UI -->
{:else if mode === TaskDetailsMode.Update}
  <TaskDetailsMainPanel {mode} {td} />
  <TaskDetailsSidebar {mode} {td} />
{/if}

<style>
</style>
