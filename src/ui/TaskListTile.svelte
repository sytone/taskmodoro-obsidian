<script lang="ts">
  import type { Task } from '../file-interface';
  import { calendar, hourglass, externalLink } from '../graphics';
  import {
    DatePickerModal,
    RepeatPickerModal,
    TaskDetailsModal,
  } from '../modals';
  import type TQPlugin from '../main';
  import type { Component } from 'obsidian';
  import { MarkdownRenderer } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import Checkbox from './Checkbox.svelte';
  import PomodoroTaskStartBtn from './PomodoroTaskStartBtn.svelte';
  import type moment from 'moment';
  import {
    TaskDetailsMode,
    TaskListTileParent,
  } from '../enums/component-context';
import {TaskDetails} from '../task-details';
  type Moment = moment.Moment;

  export let plugin: TQPlugin;
  export let task: Task;
  export let view: Component;
  export let parent: TaskListTileParent;

  let td: TaskDetails;
  let taskNameEl: HTMLElement;
  let isHeaderFocus = false;


  $: {
    td = new TaskDetails(plugin, task);
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
      window.moment(td.due),
      'Due date',
      (newDueDate: Moment) => {
        plugin.fileInterface.updateFMProp(
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
      window.moment(td.due),
      'Schedule date',
      (newScheduledDate: Moment) => {
        plugin.fileInterface.updateFMProp(
          task.file,
          plugin.app.vault,
          newScheduledDate,
          'scheduled',
        );
      },
    ).open();
  };

  const showRepeatPicker = () => {
    new RepeatPickerModal(plugin.app, td.repeat, (repeatConfig: string) => {
      td.repeat = repeatConfig;
      td=td
      plugin.fileInterface.updateTaskRepeat(
        task.file,
        plugin.app.vault,
        repeatConfig,
      );
    }).open();
  };

  const showPomodoroTaskView = async () => {
    await plugin.activatePomodoroTaskView(task, td.pomoDuration);
  };

  const headerMouseOver = () => {
    isHeaderFocus = true;
  };

  const headerMouseLeave = () => {
    isHeaderFocus = false;
  };

  const openTaskDetails = () => {
    new TaskDetailsModal(plugin, TaskDetailsMode.Update, task).open();
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
        {#if td.due}
          <span class="group" on:click={showDuePicker}>
            {@html calendar}
            <span id="due">{td.due.format('YYYY-MM-DD')}</span>
          </span>
        {/if}
        {#if td.scheduled}
          <span class="group" on:click={showSchedulePicker}>
            {@html hourglass}
            <span id="scheduled">{td.scheduled.format('YYYY-MM-DD')}</span>
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

  .task-title:hover {
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
