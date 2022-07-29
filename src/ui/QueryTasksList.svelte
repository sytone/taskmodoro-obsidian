<script lang="ts">
  import type TQPlugin from '../main';
  import { CalcTaskScore, Task } from '../FileInterface';
  import TaskTile from './TaskTile/TaskTile.svelte';
  import type { Component } from 'obsidian';
  import { Dictionary, every, filter, forEach, groupBy, sortBy } from 'lodash';
  import type { Writable } from 'svelte/store';
  import { TaskListTileParent } from '../Enums/component-context';
  import { TaskDetails } from '../TaskDetails';
  import type { Query } from '../Query';

  export let plugin: TQPlugin;
  export let view: Component;

  export let query: Query;

    const getHeading = (level: number, name: string) =>{
    level = level + 4
    level = level > 6 ? 6 : level
    return `<h${level}>${name}</h${level}>`;
  }

  // As task is modified, this codeblock will rerun at least four times
  // Modifying task will trigger at least two events - changed and resolved
  // Each event will trigger this codeblock at least two times because
  // In tasksCache store we trigger reactivity first by assigning new value to key
  // And then by returning that modified object in update callback, hence two times.

  // TODO: Find out where other reloads come from and improve reload number

  let tasksCache = plugin.taskCache.tasks;
  $: tasks = Object.keys($tasksCache).map((key) => $tasksCache[key]);
  $: taskGroups = query.applyQueryToTasks(tasks).groups;

</script>

<div class="tq">
  <div class="query-tasks-list">
    {#each taskGroups as taskGroup (taskGroup)}
    {#each taskGroup.groupHeadings as groupHeading}
        {@html getHeading(groupHeading.nestingLevel,groupHeading.name)}
    {/each}
      {#each taskGroup.tasks as task (task.file.path)}
        <TaskTile
          {view}
          td={new TaskDetails(plugin, task)}
          parentComponent={TaskListTileParent.TasksList}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
</style>
