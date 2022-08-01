<script lang="ts">
  import type TQPlugin from '../main';
  import TaskTile from './TaskTile/TaskTile.svelte';
  import { TaskListTileParent } from '../Enums/component-context';
  import { TaskDetails } from '../TaskDetails';
  import type { Query } from '../Query';
  import { onDestroy, onMount } from 'svelte';
  import type { TaskGroup } from '../Query/TaskGroup';

  export let plugin: TQPlugin;

  export let query: Query;

  const getHeading = (level: number, name: string) => {
    level = level + 4;
    level = level > 6 ? 6 : level;
    return `<h${level}>${name}</h${level}>`;
  };

  let taskGroups: TaskGroup[] = [];

  // As task is modified, this codeblock will rerun at least four times
  // Modifying task will trigger at least two events - changed and resolved
  // Each event will trigger this codeblock at least two times because
  // In tasksCache store we trigger reactivity first by assigning new value to key
  // And then by returning that modified object in update callback, hence two times.

  const unsubscribe = plugin.taskCache.tasks.subscribe((tasksCache) => {
    const tasks = Object.keys(tasksCache).map((key) => tasksCache[key]);
    taskGroups = query.applyQueryToTasks(tasks).groups;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="taskmodoro">
  <div class="query-tasks-list">
    {#each taskGroups as taskGroup (taskGroup)}
      {#each taskGroup.groupHeadings as groupHeading}
        {@html getHeading(groupHeading.nestingLevel, groupHeading.name)}
      {/each}
      {#each taskGroup.tasks as task (task.file.path)}
        <TaskTile
          td={new TaskDetails(plugin, task)}
          parentComponent={TaskListTileParent.TasksList}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
</style>
