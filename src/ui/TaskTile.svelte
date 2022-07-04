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
  import type { FilePath } from '../file-interface';

  type Moment = moment.Moment;

  export let view: Component;
  export let parentComponent: TaskListTileParent;
  export let td: TaskDetails;

  let tasksNav = td.plugin.taskNav.tasksNavigation;
  let taskNameEl: HTMLElement;
  let showTrailingMenu = false;

  // TODO: Links in rendered markdown do not work yet

  onMount(() => {
    const tempEl = createDiv();
    MarkdownRenderer.renderMarkdown(
      td.taskName,
      tempEl,
      td.file ? td.file.path : './',
      view,
    );
    taskNameEl.innerHTML = tempEl.children.length !== 0
        ? tempEl.children[0].innerHTML
        : tempEl.innerHTML;
  });

  afterUpdate(() => {
    const tempEl = createDiv();
    MarkdownRenderer.renderMarkdown(
      td.taskName,
      tempEl,
      td.file ? td.file.path : './',
      view,
    );
    if(!taskNameEl) return
    taskNameEl.innerHTML = tempEl.children.length !== 0
        ? tempEl.children[0].innerHTML
        : tempEl.innerHTML;
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

  const openTaskDetails = () => {
    $tasksNav.push(td.file.path);
    $tasksNav=[...$tasksNav]

    //We open new modal only if there were previously no tasks in task navigation
    if ($tasksNav.length == 1) {
      new TaskDetailsModal(td.plugin, TaskDetailsMode.Update).open();
    }
  };
</script>

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
      <TaskTileProps bind:td />
    </div>
    <TrailingMenu
      {showTrailingMenu}
      bind:td
      showTimerOpenBtn={parentComponent !=
        TaskListTileParent.TaskDetailsMainPanel}
    />
  </div>
</div>

<style>
  .task-tile {
    display: flex;
    flex-direction: column;
  }

  :global(.subtasks-list .task-tile) {
    margin: 16px 0;
    background-color: var(--background-nav);
    font-size: 1.25rem;
    font-weight: 700;
  }

  :global(.subtasks-list .task-title) {
    margin: 8px 0;
    background-color: var(--background-nav);
  }

  :global(.subtasks-list .header-content) {
    margin-left:8px;
  }

  :global(.timer-task-container .task-tile, .query-tasks-list .task-tile) {
    border-radius: 10px;
    padding: 8px 8px;
    margin: 8px 0;
  }

  :global(.timer-task-container .leading, .query-tasks-list .leading) {
    margin-top: 8px;
  }

  :global(.timer-task-container .task-tile) {
    background-color: #202327;
    border: thin solid #343941;
  }

  :global(.query-tasks-list .task-tile) {
    background-color: var(--background-secondary);
    border: thin solid var(--background-secondary);
  }

  .header {
    position: relative;
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
    flex: 1;
  }

  .task-title {
    display: inline-block;
    margin: 0 8px;
    font-size: 1.25rem;
  }
</style>
