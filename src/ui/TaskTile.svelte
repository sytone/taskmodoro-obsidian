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

  let expanded:boolean
  let tasksNav = td.plugin.taskNav.tasksNavigation;
  let taskCache = td.plugin.taskCache.tasks;
  let expState = td.plugin.expState.expandedState;
  let taskNameEl: HTMLElement;
  let showTrailingMenu = false;
  let showExpansionBtn = false;

  onMount(() => {
    if(td.file && $expState[td.file.path]!==undefined){
      expanded=$expState[td.file.path]
    }else{
      expanded=false
    }
    Render.renderMD(td.taskName, taskNameEl);
  });

  afterUpdate(() => {
    Render.renderMD(td.taskName, taskNameEl);
  });

  const toggleChecked = () => {
    if (td.file) {
      td.plugin.taskCache.toggleChecked(td);
    } else {
      td.completed = !td.completed;
      td = td;
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
    if(td.file && expanded !== undefined){
      $expState[td.file.path] = expanded;
    }
  };

  $: {
    showExpansionBtn =
      td.subtasks.length > 0 &&
      parentComponent === TaskTileParent.TaskDetailsMainPanel;
    cacheExpandedState(expanded);
  }
</script>

<div class="task-tile-wrapper">
  <SubtasksExpansionBtn {showExpansionBtn} bind:expanded />
  <div class="task-tile">
    <div
      class="header"
      on:mouseover={headerMouseOver}
      on:focus={headerMouseOver}
      on:mouseleave={headerMouseLeave}
    >
      <span class="leading">
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
        {#if parentComponent !=
          TaskListTileParent.TimerTaskView}
        <TaskTileProps bind:td />
        {/if}
      </div>
      <TrailingMenu
        {showTrailingMenu}
        {td}
        showTimerOpenBtn={parentComponent !=
          TaskListTileParent.TimerTaskView}
      />
    </div>
    <div class="nested-subtasks-list {!expanded ? 'show-transition' : ''}">
      {#if parentComponent === TaskTileParent.TaskDetailsMainPanel && expanded}
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
  .show-transition {
    transform: translateY(-100px);
    opacity: 0;
  }

  .nested-subtasks-list {
    margin-left: 36px;
    transition: all 0.1s cubic-bezier(0.02,0.01,0.47,1);
    transform: translateY(0);
    opacity: 1;
  }

  :global(.nested-subtasks-list div.chevron-wrapper) {
    margin-left: -24px;
  }

  .task-tile {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow:hidden
  }

  .task-tile-wrapper {
    display: flex;
    flex-direction: row;
    position:relative
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

  :global(.subtasks-list .header-content) {
    margin-left: 8px;
  }

  :global(.subtasks-list .leading) {
    margin-top: 2px;
  }

  :global(.timer-task-container .task-tile, .query-tasks-list .task-tile) {
    border-radius: 10px;
    padding: 8px 8px;
    margin: 4px 0;
  }

  :global(.query-tasks-list .leading) {
    margin-top: 8px;
  }

  :global(.timer-task-container .leading) {
    margin-top: 2px;
  }

  :global(.timer-task-container .task-tile) {
    background-color: #202327;
    border: thin solid #343941;
  }

  :global(.query-tasks-list .task-tile) {
    background-color: var(--background-secondary);
    border: thin solid var(--background-secondary);
  }

  :global(.query-tasks-list .task-title) {
    padding-right: 24px;
  }

  :global(.timer-task-container .task-title) {
    padding-right: 16px;
  }


  .header-content{
    overflow:hidden
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
