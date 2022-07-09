<script lang="ts">
  import TaskDetailsNavigation from './TaskDetailsNavigation.svelte';

  import TaskDetailsSubtaskSection from './TaskDetailsSubtaskSection.svelte';
  import { htmlToMarkdown } from 'obsidian';

  import type { TaskDetails } from '../../task-details';
  import { TaskDetailsMode } from '../../enums/component-context';
  import Checkbox from './../Checkbox.svelte';
  import { onMount } from 'svelte';
  import Cursor from '../../helpers/cursor';
  import { Render } from '../../helpers/render';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let taskNameEl: HTMLElement;
  let descriptionEl: HTMLElement;
  let temp = { taskName: td.taskName, description: td.description };
  let isInputEnabled = { taskName: false, description: false };

  onMount(() => {
    renderTaskInput(isInputEnabled, td.taskName, td.description);
    Cursor.setCurrentCursorPosition(td.taskName.length, taskNameEl);
  });

  $: {
    renderTaskInput(isInputEnabled, td.taskName, td.description);
    temp.taskName=td.taskName
    temp.description=td.description
  }

  const removeLeadingWhitespace = (input: any) => {
    input.taskName = Render.removeLeadingWhitespace(input.taskName);
    input.description = Render.removeLeadingWhitespace(input.description);
  };

  const renderTaskInput = (
    _isInputEnabled: { taskName: boolean; description: boolean },
    taskName: string,
    description: string,
  ) => {
    if (!_isInputEnabled.taskName) {
      Render.renderMD(taskName, taskNameEl, td.file);
    } else {
      Render.displayMD(taskName, taskNameEl);
    }

    if (!_isInputEnabled.description) {
      Render.renderMD(description, descriptionEl, td.file);
    } else {
      Render.displayMD(description, descriptionEl);
    }
  };

  const onEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      window.getSelection().removeAllRanges();
    }
  };

  const submitInput = () => {
    removeLeadingWhitespace(temp)
    // console.log('td:',td.taskName,' temp:',temp.taskName,'name=? ',td.taskName==temp.taskName)
    // console.log('td:',td.description,' temp:',temp.description,'des=? ',td.description==temp.description)
    if (td.taskName !== temp.taskName) {
      td.taskName = temp.taskName;
      if(mode === TaskDetailsMode.Update){
        td.plugin.fileInterface.updateTaskName(td.file, td.taskName);
      }
    }
    if (td.description !== temp.description) {
      td.description = temp.description;
      if(mode === TaskDetailsMode.Update){
      td.plugin.fileInterface.updateDescription(td.file, td.description);
      }
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
        autocorrect="false"
        contenteditable="true"
        bind:this={taskNameEl}
        on:input={onTaskNameInput}
        on:keypress={onEnter}
        on:focusin={() => {
          submitInput();
          isInputEnabled.taskName = true;
          isInputEnabled = isInputEnabled;
        }}
        on:focusout={() => {
          submitInput();
          isInputEnabled.taskName = false;
          isInputEnabled = isInputEnabled;
        }}
      />

      <div
        class="task-input-description"
        placeholder="Description"
        autocorrect="false"
        contenteditable="true"
        bind:this={descriptionEl}
        on:input={onDescriptionInput}
        on:keypress={onEnter}
        on:focusin={() => {
          submitInput();
          isInputEnabled.description = true;
          isInputEnabled = isInputEnabled;
        }}
        on:focusout={() => {
          submitInput();
          isInputEnabled.description = false;
          isInputEnabled = isInputEnabled;
        }}
      />
    </div>
  </div>
  <TaskDetailsSubtaskSection bind:td {mode} />
</div>

<style>
  .tq-checkbox-wrapper {
    margin-top: 10px;
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
