<script lang="ts">
  import type { Task } from '../file-interface';
  import { calendar, hourglass, externalLink } from '../graphics';
  import {
    DatePickerModal,
    RepeatPickerModal,
    TaskDetailsModal,
  } from '../modals';
  import type TQPlugin from '../main';
  import { slide } from 'svelte/transition';
  import type { Component } from 'obsidian';
  import { MarkdownRenderer } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import TaskPriorityStripe from './TaskPriorityStripe.svelte';
  import Checkbox from './Checkbox.svelte';
  import PomodoroTaskStartBtn from './PomodoroTaskStartBtn.svelte';
  import moment from 'moment';
  import { TaskDetailsMode, TaskListTileParent } from '../enums/component-context';
  type Moment = moment.Moment;

  export let plugin: TQPlugin;
  export let task: Task;
  export let view: Component;
  export let parent: TaskListTileParent;

  let taskNameEl: HTMLElement;
  let expanded = false;
  let repeat: any;
  let due: Moment;
  let scheduled: Moment;
  let description: String;
  let completed: any;
  let lastCompleted: any;
  let overdue: boolean;
  let isHeaderFocus = false;

  $: {
    due = task.due;
    repeat = task.frontmatter.get('repeat');
    scheduled = task.scheduled;
    description = task.description;
    completed = task.frontmatter.get('completed');
    lastCompleted = completed ? completed[completed.length - 1] : undefined;
    overdue = (!task.checked && task.due?.isBefore(window.moment())) || false;
  }

  let taskTileBg =
    parent === TaskListTileParent.TasksList
      ? 'var(--background-secondary)'
      : '#202327';

  let taskTileborderColor =
    parent === TaskListTileParent.TasksList
      ? 'var(--background-secondary)'
      : '#343941';

  let CSSvarStyles = `--taskTileBg: ${taskTileBg}; --taskTileBorderColor: ${taskTileborderColor}`;
  // TODO: Links in rendered markdown do not work yet

  onMount(() => {
    const tempEl = createDiv();
    MarkdownRenderer.renderMarkdown(
      task.taskName,
      tempEl,
      task.file.path,
      view,
    );
    taskNameEl.innerHTML = tempEl.children[0].innerHTML;
  });

  afterUpdate(() => {
    const tempEl = createDiv();
    MarkdownRenderer.renderMarkdown(
      task.taskName,
      tempEl,
      task.file.path,
      view,
    );
    taskNameEl.innerHTML = tempEl.children[0].innerHTML;
  });

  const toggleChecked = () => {
    plugin.taskCache.toggleChecked(task);
  };

  const viewSource = () => {
    let leaf = plugin.app.workspace.activeLeaf;
    if (leaf.getViewState().pinned) {
      leaf = plugin.app.workspace.createLeafBySplit(leaf);
    }
    leaf.openFile(task.file);
  };

  const showDuePicker = () => {
    new DatePickerModal(
      plugin.app,
      window.moment(due),
      'Due date',
      (newDueDate: Moment) => {
        plugin.fileInterface.updateTaskDate(
          task.file,
          plugin.app.vault,
          newDueDate,
          'due',
        );
      },
    ).open();
  };

  const showSchedulePicker = () => {
    new DatePickerModal(
      plugin.app,
      window.moment(due),
      'Schedule date',
      (newScheduledDate: Moment) => {
        plugin.fileInterface.updateTaskDate(
          task.file,
          plugin.app.vault,
          newScheduledDate,
          'scheduled',
        );
      },
    ).open();
  };

  const showRepeatPicker = () => {
    new RepeatPickerModal(plugin.app, repeat, (repeatConfig: string) => {
      repeat = repeatConfig;
      plugin.fileInterface.updateTaskRepeat(
        task.file,
        plugin.app.vault,
        repeatConfig,
      );
    }).open();
  };

  const showPomodoroTaskView = async () => {
    await plugin.activatePomodoroTaskView(task, moment.duration(16, 'seconds'));
  };

  const headerMouseOver = () => {
    isHeaderFocus = true;
  };

  const headerMouseLeave = () => {
    isHeaderFocus = false;
  };

  const openTaskDetails = () => {
    new TaskDetailsModal(plugin,TaskDetailsMode.Update,task).open();
  };
</script>

<div style={CSSvarStyles} class="task-list-tile">
  <div
    class="header"
    on:mouseover={headerMouseOver}
    on:focus={headerMouseOver}
    on:mouseleave={headerMouseLeave}
  >
    <span class="leading">
      <Checkbox context="listTile" bind:checked={task.checked} />
      {#if parent == TaskListTileParent.TasksList}
        <PomodoroTaskStartBtn
          on:click={showPomodoroTaskView}
          context="listTile"
        />
      {/if}
    </span>
    <div class="header-content">
      <div
        on:click={openTaskDetails}
        class="task-title"
        bind:this={taskNameEl}
      />
      <div class="props">
        {#if due}
          <span class="group" on:click={showDuePicker}>
            {@html calendar}
            <span id="due">{due.format('YYYY-MM-DD')}</span>
          </span>
        {/if}
        {#if scheduled}
          <span class="group" on:click={showSchedulePicker}>
            {@html hourglass}
            <span id="scheduled">{scheduled.format('YYYY-MM-DD')}</span>
          </span>
        {/if}
      </div>
    </div>
    {#if isHeaderFocus}
      <span class="trailing">
        <span class="external-link-wrapper" on:click={viewSource}>
          {@html externalLink}
        </span>
      </span>
    {/if}
  </div>
</div>

<style>
  .header {
    position: relative;
  }

  .task-title:hover{
    cursor: pointer;
  }
  
  .trailing {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 4px 12px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--taskTileBg) 10%,
      var(--taskTileBg)
    );
    height: 2rem;
  }

  .external-link-wrapper:hover {
    cursor: pointer;
  }

  :global(.trailing > .external-link-icon) {
  }

  .leading {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  .group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 8px;
  }

  .group:hover {
    cursor: pointer;
  }

  .props {
    font-size: 1rem;
    display: flex;
    flex-direction: row;
  }

  #due {
    padding-left: 4px;
    color: #8562cb;
  }

  #scheduled {
    padding-left: 4px;
    color: #54a8b4;
  }

  .header > .leading {
    margin-top: 8px;
  }

  .task-list-tile {
    display: flex;
    flex-direction: column;
    background-color: var(--taskTileBg);
    border-radius: 10px;
    border: thin solid var(--taskTileBorderColor);
    padding: 8px 8px;
    margin: 8px 0;
  }

  .task-list-tile > .header {
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
