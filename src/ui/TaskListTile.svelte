<script lang="ts">
  import type { Task } from '../file-interface';
  import { calendar, hourglass, externalLink } from '../graphics';
  import {
    DuePickerModal as DatePickerModal,
    RepeatPickerModal,
  } from '../modals';
  import type TQPlugin from '../main';
  import type { Moment } from 'moment';
  import { slide } from 'svelte/transition';
  import type { Component } from 'obsidian';
  import { MarkdownRenderer } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import TaskPriorityStripe from './TaskPriorityStripe.svelte';
  import Checkbox from './Checkbox.svelte';
  import TaskPomodoroStartBtn from './TaskPomodoroStartBtn.svelte';
  export let plugin: TQPlugin;
  export let task: Task;
  export let view: Component;

  let taskNameEl: HTMLElement;
  let expanded = false;

  let repeat: any;
  let due: Moment;
  let scheduled: Moment;
  let description: String;
  let completed: any;
  let lastCompleted: any
  let overdue: boolean
  $: {
    due = task.due;
    repeat = task.frontmatter.get('repeat');
    scheduled = task.scheduled;
    description = task.description;
    completed = task.frontmatter.get('completed');
    lastCompleted = completed ? completed[completed.length - 1] : undefined;
    overdue =
    (!task.checked && task.due?.isBefore(window.moment())) || false;

  }

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

  const toggleExpanded = (event: MouseEvent) => {
    expanded = !expanded;
  };

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
</script>

<div class="task-list-tile">
  <div class="header">
    <span class="leading">
      <Checkbox
        context="listTile"
        bind:checked={task.checked}
        on:toggle={toggleChecked}
      />
      <TaskPomodoroStartBtn context="listTile"/>
    </span>
    <div class="header-content">
      <div class="task-title" bind:this={taskNameEl} />
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
  </div>
</div>

<style>
  .leading{
    display:flex;
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
    /* width: 20px;
    min-width: 20px; */
  }

  .task-list-tile {
    display: flex;
    flex-direction: column;
    background-color: var(--background-secondary);
    border-radius: 10px;
    border-bottom: thin solid var(--background-modifier-border);
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
