<script lang="ts">
  import type { FilePath } from '../../FileInterface';
  import type { Writable } from 'svelte/store';
  import type { Task } from '../../FileInterface';
  import type TQPlugin from '../../main';
import { getTextAbv } from '../../Helpers/Helpers';

  export let plugin: TQPlugin;

  let tasksNav: Writable<FilePath[]> = plugin.taskNav.tasksNavigation;
  let tasksCache = plugin.taskCache.tasks;
  let tasksNavMap: Map<FilePath, string>;

  const getTasksNavMap = (
    tasksNav: FilePath[],
    tasksCache: Record<string, Task>,
  ): Map<FilePath, string> => {
    let navigationTexts: string[] = [];
    let tasksNavMap: Map<FilePath, string> = new Map();
    for (const taskPath of tasksNav) {
      let task = tasksCache[taskPath];
      let navText = getTextAbv(task.taskName,20)

      tasksNavMap.set(taskPath, navText);
      navigationTexts = [navText, ...navigationTexts];
    }

    return tasksNavMap;
  };

  const navigateToTask = (targetTask: FilePath) => {
    let _tasksNav = [];
    for (let task of tasksNavMap.keys()) {
      if (task === targetTask) {
        _tasksNav.push(targetTask);
        break;
      } else {
        _tasksNav.push(task);
      }
    }
    $tasksNav = _tasksNav;
  };

  $: tasksNavMap = getTasksNavMap($tasksNav, $tasksCache);
</script>

<div class="task-navigation">
  {#if tasksNavMap.size > 1}
    {#each [...tasksNavMap.keys()] as taskPath (taskPath)}
      <span on:click={() => navigateToTask(taskPath)} class="navigation-text"
        >{tasksNavMap.get(taskPath)}</span
      >
      <span class="navigation-seperator">></span>
    {/each}
  {/if}
</div>

<style>
  .task-navigation {
    min-height: 56px;
  }

  .navigation-text:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .navigation-seperator {
    padding: 0 4px;
  }
</style>
