<script lang="ts">
  import type { Task } from '../file-interface';
  import { chevronDown, externalLink, overdueAlert } from '../graphics';
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
  const completed = task.frontmatter.get('completed');
  const lastCompleted = completed ? completed[completed.length - 1] : undefined;
  const overdue =
    (!task.checked && task.due?.isBefore(window.moment())) || false;

  $: rootClasses = 'tq-task ' + (expanded ? 'expanded-root' : '');

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

<div class={rootClasses}>
  <div class="list-tile">
    <Checkbox bind:checked={task.checked} on:toggle={toggleChecked} />
    <span class="task-title" bind:this={taskNameEl} />
  </div>
</div>

<!-- <div class={rootClasses}>
  <div class="list-tile">
    <TaskPriorityStripe {task} />

    <input
      type="checkbox"
      bind:checked={task.checked}
      on:change={toggleChecked}
    />
    <span class="task-line" bind:this={lineEl} />

    {#if overdue}
      <span class="overdue-alert" title="Due {task.due.format('YYYY-MM-DD')}">
        {@html overdueAlert}
      </span>
    {/if}

    <span on:click={viewSource} title="View note">
      {@html externalLink}
    </span>

    {#if !expanded}
      <span
        class="expand-chevron"
        on:click={toggleExpanded}
        title="See details"
      >
        {@html chevronDown}
      </span>
    {:else}
      <span
        class="expand-chevron rotated-180"
        on:click={toggleExpanded}
        title="Hide details"
      >
        {@html chevronDown}
      </span>
    {/if}
  </div>

  {#if expanded}
    <div
      class="task-content"
      transition:slide={{
        duration: 300,
      }}
    >
      <div>
        <span class="label">Due:</span>
        <input
          type="text"
          class="value"
          value={due ? due.format('YYYY-MM-DD') : 'No due date'}
          on:click={showDuePicker}
        />
      </div>
      <div>
        <span class="label">Repeat Schedule:</span>
        <input
          type="text"
          class="value"
          value={repeat || 'Does not repeat'}
          on:click={showRepeatPicker}
        />
      </div>
      {#if lastCompleted !== undefined}
        <div>
          <span class="label">Last Completed:</span>
          <input type="text" class="value" value={lastCompleted} disabled />
        </div>
      {/if}

      
      <div>
        <span class="label">Note:</span>
        <input type="text" class="value" value={note ? note : ''} />
      </div>
    </div>
  {/if}
</div> -->
<style>
  .tq-task {
    background-color: var(--background-secondary);
    border-bottom: thin solid var(--background-modifier-border);
    padding: 5px;
  }

  .list-tile {
    display: flex;
    flex: 1;
  }
</style>
