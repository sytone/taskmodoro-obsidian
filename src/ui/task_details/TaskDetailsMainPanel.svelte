<script lang="ts">
  import TaskDetailsNavigation from './TaskDetailsNavigation.svelte';

  import TaskDetailsSubtaskSection from './TaskDetailsSubtaskSection.svelte';
  import { htmlToMarkdown } from 'obsidian';

  import type { TaskDetails } from '../../task-details';
  import type { TaskDetailsMode } from '../../enums/component-context';
  import Checkbox from './../Checkbox.svelte';
  import { onMount } from 'svelte';
  import Cursor from '../../cursor';
  import { Render } from '../../render';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let taskNameEl: HTMLElement;
  let descriptionEl: HTMLElement;
  let temp = { taskName: td.taskName, description: td.description };
  let isTaskNameInputEnabled = false;
  let isDescriptionInputEnabled = false;

  onMount(() => {
    removeLeadingWhitespace(td);
    renderTaskInput(
      isTaskNameInputEnabled,
      isDescriptionInputEnabled,
      td.taskName,
      td.description,
    );
    Cursor.setCurrentCursorPosition(td.taskName.length, taskNameEl);
  });

  $: {
    removeLeadingWhitespace(td);
    renderTaskInput(
      isTaskNameInputEnabled,
      isDescriptionInputEnabled,
      td.taskName,
      td.description,
    );
  }

  const removeLeadingWhitespace = (_td: TaskDetails) => {
    _td.taskName = Render.removeLeadingWhitespace(_td.taskName);
    _td.description = Render.removeLeadingWhitespace(_td.description);
  };

  const renderTaskInput = (
    _isTaskNameInputFocus: boolean,
    _isDescriptionInputFocus: boolean,
    taskName: string,
    description: string,
  ) => {

    if (!_isTaskNameInputFocus) {

      Render.renderMD(taskName, taskNameEl, td.file);
    } else {
      Render.displayMD(taskName, taskNameEl);
    }

    if (!_isDescriptionInputFocus) {
      Render.renderMD(description, descriptionEl, td.file);
    } else {
      Render.displayMD(description, descriptionEl);
    }
  };

  const onEnterTaskName = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      td.taskName=temp.taskName
      td.plugin.fileInterface.updateTaskName(td.file,temp.taskName)
      isTaskNameInputEnabled = false;
      window.getSelection().removeAllRanges();
    }
  };

  const onEnterDescription = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      td.description=temp.description
      td.plugin.fileInterface.updateDescription(td.file,temp.description)
      isDescriptionInputEnabled = false;
      window.getSelection().removeAllRanges();
    }
  };

  const onTaskNameInput = (event: any) => {
    temp.taskName = htmlToMarkdown(event.target.innerHTML);

  };

  const onDescriptionInput = (event: any) => {
    temp.description = htmlToMarkdown(event.target.innerHTML);

  };
</script>

<div class="main-task-panel">
  <TaskDetailsNavigation plugin={td.plugin} />
  <div class="task-container">
    <div class="tq-checkbox-wrapper">
      <Checkbox bind:checked={td.completed} disabled={false} />
    </div>
    <div class="task-input-container ">
      <div
        class="task-input-name"
        placeholder="Task name"
        contenteditable="true"
        bind:this={taskNameEl}
        on:input={onTaskNameInput}
        on:keypress={onEnterTaskName}
        on:click={() => {
          isTaskNameInputEnabled = true;
        }}
      />

      <div
        class="task-input-description"
        placeholder="Description"
        contenteditable="true"
        bind:this={descriptionEl}
        on:input={onDescriptionInput}
        on:keypress={onEnterDescription}
        on:click={() => {
          isDescriptionInputEnabled = true;
        }}
      />
    </div>
  </div>
  <TaskDetailsSubtaskSection bind:td {mode} />
</div>

<style>
  .tq-checkbox-wrapper {
    margin-top: 8px;
  }

  [contenteditable='true']:empty:before {
    content: attr(placeholder);
    color: var(--dark-blue-gray);
    font-size: 1rem;
    font-weight: normal;
  }

  .task-input-name {
    border: none;
    border-bottom: 1px solid var(--dark2-blue-gray);
    padding: 8px 0;
    font-size: 1.25rem;
    font-weight: 700;
    width: 100%;
    overflow: hidden;
    background-color: transparent;
  }

  .task-input-name::placeholder {
    border: none;
    color: var(--dark-blue-gray);
    font-size: 1rem;
    font-weight: normal;
  }

  .task-input-description {
    border: none;
    padding: 8px 0;
    background-color: transparent;
  }

  .task-input-container {
    margin: 0 16px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .task-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
  }

  .main-task-panel {
    background-color: var(--background-nav);
    width: 70%;
    padding: 24px 24px;
  }
</style>
