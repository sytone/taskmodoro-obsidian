<script lang="ts">
  import { TaskDetailsModal } from '../modals';
  import type { Component } from 'obsidian';
  import { MarkdownRenderer } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import Checkbox from './Checkbox.svelte';
  import type moment from 'moment';
  import {
    TaskDetailsMode,
    TaskListTileParent,
  } from '../enums/component-context';
  import type { TaskDetails } from 'src/task-details';
  import TaskTileProps from './TaskTileProps.svelte';
  import TrailingMenu from './TrailingMenu.svelte';
  import { TaskListTileParent as TaskTileParent } from './../enums/component-context';
  import type { Task } from '../file-interface';
  import SubtasksExpansionBtn from './SubtasksExpansionBtn.svelte';
  import { Render } from '../helpers/render';

  type Moment = moment.Moment;

  export let view: Component;
  export let parentComponent: TaskListTileParent;
  export let td: TaskDetails;

  let expanded: boolean;
  let tasksNav = td.plugin.taskNav.tasksNavigation;
  let taskCache = td.plugin.taskCache.tasks;
  let expState = td.plugin.expState.expandedState;
  let taskNameEl: HTMLElement;
  let showTrailingMenu = false;
  let showExpansionBtn = false;

  onMount(() => {
    if (td.file && $expState[td.file.path] !== undefined) {
      expanded = $expState[td.file.path];
    } else {
      expanded = false;
    }
    Render.renderMD(td.taskName, taskNameEl);
  });

  afterUpdate(() => {
    Render.renderMD(td.taskName, taskNameEl);
  });

  const toggleChecked = () => {
    td.completed = !td.completed;
    td = td;
    if (td.file) {
      td.plugin.taskCache.toggleChecked(td);
    }
  };

  const headerMouseOver = () => {
    showTrailingMenu = true;
  };

  const headerMouseLeave = () => {
    showTrailingMenu = false;
  };

  const findTaskNavPath = (task: Task, insertIdx: number): boolean => {
    let idx = task.subtasks.findIndex((st) => st.file.path === td.file.path);
    if (idx >= 0) {
      $tasksNav.push(task.subtasks[idx].file.path);
      return true;
    } else {
      for (let subtask of task.subtasks) {
        let isFound = findTaskNavPath(subtask, insertIdx);
        let isInTaskNav = $tasksNav.contains(subtask.file.path);
        if (isFound && !isInTaskNav) {
          $tasksNav.splice(insertIdx, 0, subtask.file.path);
          return true;
        }
      }
      return false;
    }
  };

  const openTaskDetails = () => {
    let lastTaskNavTask = $taskCache[$tasksNav.last()];
    if (lastTaskNavTask) {
      findTaskNavPath(lastTaskNavTask, $tasksNav.length);
    } else {
      $tasksNav.push(td.file.path);
    }
    $tasksNav = [...$tasksNav];

    //We open new modal only if there were previously no tasks in task navigation
    if ($tasksNav.length == 1) {
      new TaskDetailsModal(td.plugin, TaskDetailsMode.Update).open();
    }
  };

  const cacheExpandedState = (expanded: boolean) => {
    if (td.file && expanded !== undefined) {
      $expState[td.file.path] = expanded;
    }
  };

  $: {
    showExpansionBtn = td.subtasks.length > 0;
    cacheExpandedState(expanded);
  }
</script>

<div class="task-tile-wrapper">
  <div class="task-tile">
    <div
    class="header"
    on:mouseover={headerMouseOver}
      on:focus={headerMouseOver}
      on:mouseleave={headerMouseLeave}
      >
      <span class="leading">
        <SubtasksExpansionBtn {showExpansionBtn} bind:expanded />
        <Checkbox
          context="listTile"
          on:toggle={toggleChecked}
          checked={td.completed}
          />
        </span>
        <div class="header-content">
        <div
        on:click={openTaskDetails}
        class="task-title"
        bind:this={taskNameEl}
        />
        {#if parentComponent != TaskListTileParent.TimerTaskView}
          <TaskTileProps bind:td />
        {/if}
      </div>
      <TrailingMenu
        {showTrailingMenu}
        {td}
        showTimerOpenBtn={parentComponent != TaskListTileParent.TimerTaskView}
      />
    </div>
    <div class="nested-subtasks-list {!expanded ? 'show-transition' : ''}">
      {#if expanded && parentComponent!== TaskTileParent.TimerTaskView}
      {#each td.subtasks as subtask (subtask.taskName)}
      <svelte:self
      parentComponent={TaskTileParent.TaskDetailsMainPanel}
            bind:td={subtask}
            view={null}
          />
        {/each}
      {/if}
    </div>
  </div>
</div>
  
<style>
  .task-tile-wrapper{
    position:relative
  }
  .show-transition {
    transform: translateY(-100px);
    opacity: 0;
  }

  .nested-subtasks-list {
    transition: all 0.1s cubic-bezier(0.02, 0.01, 0.47, 1);
    transform: translateY(0);
    opacity: 1;
  }

  .task-tile {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* position:relative */
  }

  :global(.subtasks-list .task-tile) {
    margin: 8px 0;
    background-color: var(--background-nav);
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  :global(.subtasks-list .task-title) {
    margin: 8px 0;
    padding-right: 16px;
    background-color: var(--background-nav);
  }
  
  :global(.subtasks-list .leading) {
    margin-top: 2px;
  }
  
  :global(.main-task-panel .subtasks-list .header-content) {
    margin-left: 4px;
  }

  :global(.main-task-panel .nested-subtasks-list) {
    margin-left: 32px;
  }

  :global(.timer-task-container .task-tile, .query-tasks-list .task-tile) {
    border-radius: 10px;
    padding: 8px 8px;
  }

  :global(.timer-task-container .task-title) {
    padding-right: 16px;
  }

  :global(.timer-task-container .leading) {
    margin-top: 2px;
  }

  :global(.timer-task-container .task-tile) {
    background-color: #202327;
    border: thin solid #343941;
  }

  :global(.query-tasks-list .leading) {
    margin-top: 8px;
  }

  :global(.query-tasks-list .task-tile) {
    margin: 4px 0;
    border-radius: 10px;
    background-color: var(--background-secondary);
    border: thin solid var(--background-secondary);
  }

  :global(.query-tasks-list .task-tile .nested-subtasks-list .task-tile) {
    
    padding: 0px 0px 0px 8px;
    margin: 0px 0;
  }

  :global(.query-tasks-list .task-tile .nested-subtasks-list) {
    margin-left: 16px;
  }

  :global(.query-tasks-list .task-title) {
    padding-right: 24px;
  }

  .header-content {
    overflow: hidden;
  }

  .leading {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .task-title:hover {
    cursor: pointer;
  }

  .task-tile > .header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .task-title {
    display: inline-block;
    max-width: 100%;
    width: 100%;
    margin: 0 8px;
    font-size: 1.25rem;
    word-wrap: break-word;
  }
</style>
