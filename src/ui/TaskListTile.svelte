<script lang="ts">
  import type { Task } from '../file-interface';
  import {
    calendar,
    hourglass,
    chevronDown,
    externalLink,
    overdueAlert,
  } from '../graphics';
  import { DuePickerModal, RepeatPickerModal } from '../modals';
  import type TQPlugin from '../main';
  import type { Moment } from 'moment';
  import { slide } from 'svelte/transition';
  import type { Component } from 'obsidian';
  import { MarkdownRenderer } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import TaskPriorityStripe from './TaskPriorityStripe.svelte';
  import Checkbox from './Checkbox.svelte';

  export let plugin: TQPlugin;
  export let task: Task;
  export let view: Component;

  let taskNameEl: HTMLElement;
  let expanded = false;

  let repeat = task.frontmatter.get('repeat');
  let due = task.due;
  let scheduled = task.scheduled;
  const description = task.description;
  const completed = task.frontmatter.get('completed');
  const lastCompleted = completed ? completed[completed.length - 1] : undefined;
  const overdue =
    (!task.checked && task.due?.isBefore(window.moment())) || false;

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
    new DuePickerModal(plugin.app, window.moment(due), (newDate: Moment) => {
      plugin.fileInterface.updateTaskDue(task.file, plugin.app.vault, newDate);
    }).open();
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
    </span>
    <div class="header-content">
      <div class="task-title" bind:this={taskNameEl} />
      <div class="props">
        <span class="group">
          {@html calendar}
          <span id="due">{due.format('YYYY-MM-DD')}</span>
        </span>
        <span class="group">
          {@html hourglass}
          <span id="scheduled">{scheduled.format('YYYY-MM-DD')}</span>
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 8px;
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
    font-weight: 600;
  }
</style>
