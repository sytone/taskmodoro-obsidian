<script lang="ts">
  import { SharedState, filtersFromState } from '../state';
  import type TQPlugin from '../main';
  import { CalcTaskScore, Task } from '../file-interface';
  import TaskTile from './TaskTile.svelte';
  import type { Component } from 'obsidian';
  import { Dictionary, every, filter, forEach, groupBy, sortBy } from 'lodash';
  import type { Writable } from 'svelte/store';
  import {TaskListTileParent} from '../enums/component-context'
import { TaskDetails } from '../task-details';

  export let plugin: TQPlugin;
  export let view: Component;

  /**
   * Config state that is parsed from query codeblock
   */
  export let state: Writable<SharedState>;
    
  const getGrouper = (state: SharedState): ((t: Task) => string) => {
    switch (state.group) {
      case 'due':
        return (t) => t.due?.format('YYYY-MM-DD') || 'No Due Date';
      case 'completed':
        return (t) => (t.checked ? 'Complete' : 'Incomplete');
      default:
        return (_) => undefined;
    }
  };

  const getKeySorter = (state: SharedState): ((k: string) => any) => {
    const re = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.compile();
    switch (state.group) {
      case 'due':
        return (k): any => (re.test(k) ? window.moment(k) : undefined);
      case 'completed':
        return (k): any => (k === 'Complete' ? -1 : 1);
      default:
        return (_): any => 0;
    }
  };

  const getTaskSorter = (
    state: SharedState,
  ): ((a: Task, b: Task) => number) => {
    switch (state.sort) {
      case 'due':
        return (a, b) => window.moment(a.due).diff(window.moment(b.due));
      case 'score':
        return (a, b) => CalcTaskScore(a) - CalcTaskScore(b);
      default:
        return (a, b) => 0;
    }
  };

  const getTasks = (
    state: SharedState,
    tasks: Record<string, Task>,
  ): Dictionary<Task[]> => {
    const allFilters = filtersFromState(state);
    // console.log('filters: ',allFilters)
    // console.log(`completed: ${state.completed} task:`, tasks);
    const filteredTasks = filter(tasks, (t) => every(allFilters, (f) => f(t)));
    const grouper = getGrouper(state);
    const tasksGrouped = groupBy(filteredTasks, grouper);

    const taskSorter = getTaskSorter(state);
    forEach(tasksGrouped, (val) => {
      val.sort(taskSorter);
    });

    return tasksGrouped;
  };

  const getSortedKeys = (
    state: SharedState,
    tasksGrouped: Dictionary<Task[]>,
  ): string[] => {
    const keySorter = getKeySorter(state);
    const groupKeys = Object.keys(tasksGrouped);
    return sortBy(groupKeys, keySorter);
  };

  // TODO: This is performed several times as the page loads. Find how to only run once.
  // I think it might be run over and over as each task is loaded into the vault.
  let tasks = plugin.taskCache.tasks;
  $: tasksGrouped = getTasks($state, $tasks);
  $: sortedKeys = getSortedKeys($state, tasksGrouped);
</script>

<div class="tq">
  <div class='query-tasks-list'>
    {#each sortedKeys as key (key)}
      {#each tasksGrouped[key] as task (task.taskName)}
        <TaskTile {view} td={new TaskDetails(plugin,task)} parent={TaskListTileParent.TasksList} />
      {/each}
    {/each}
  </div>
</div>

<style>


</style>