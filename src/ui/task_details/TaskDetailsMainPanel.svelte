<script lang="ts">
  import TaskDetailsSubtaskSection from './TaskDetailsSubtaskSection.svelte';

  import type { TaskDetails } from '../../task-details';
  import type { TaskDetailsMode } from '../../enums/component-context';
  import Checkbox from './../Checkbox.svelte';
  import type { FilePath } from '../../file-interface';
  import type { Writable } from 'svelte/store';
  import type { Task } from '../../file-interface';
  import { keys } from 'lodash';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let tasksNav: Writable<FilePath[]> = td.plugin.taskNav.tasksNavigation;
  let tasksCache = td.plugin.taskCache.tasks;
  let tasksNavMap: Map<FilePath, string>;
  let draftTaskName = '';
  let draftDescription = '';
  let isInputActive = true;
  let isInputBtnEnabled = true;
  $: {
    draftTaskName = td.taskName;
    draftDescription = td.description;
    isInputBtnEnabled = draftTaskName != '';
  }

  const saveDraft = () => {
    td.taskName = draftTaskName;
    td.description = draftDescription;
    td = td;
    isInputActive = false;
  };

  const textareaOnClick = () => {
    isInputActive = true;
  };

  const resize = (event: any) => {
    let target = event.target;
    target.style.height = 4 + 'px';
    target.style.height = +target.scrollHeight + 'px';
  };

  const textareaResize = (el: any) => {
    el.addEventListener('input', resize);
    return {
      destroy: () => el.removeEventListener('input', resize),
    };
  };

  const getTasksNavMap = (
    tasksNav: FilePath[],
    tasksCache: Record<string, Task>,
  ): Map<FilePath, string> => {
    let navigationTexts: string[] = [];
    let tasksNavMap: Map<FilePath, string> = new Map();
    for (const taskPath of tasksNav) {
      let charCnt = 20;
      let task = tasksCache[taskPath];
      let navText: string;
      if (task.taskName.length > charCnt) {
        navText = task.taskName.substring(0, charCnt) + '...';
      } else {
        navText = task.taskName;
      }

      tasksNavMap.set(taskPath, navText);
      navigationTexts = [navText, ...navigationTexts];
    }

    return tasksNavMap;
  };

  const navigateToTask = (targetTask: FilePath) => {
    let _tasksNav =[]
    for (let task of tasksNavMap.keys())
    {
      if(task=== targetTask){
        _tasksNav.push(targetTask)
        break;
      }else{
        _tasksNav.push(task)
      }
    }
    $tasksNav = _tasksNav
  };

  $: tasksNavMap = getTasksNavMap($tasksNav, $tasksCache);
</script>

<div class="main-task-panel">
  <div class="task-navigation">
    {#if tasksNavMap.size > 1}
      {#each [...tasksNavMap.keys()] as taskPath (taskPath)}
        <span
          on:click={()=>navigateToTask(taskPath)}
          class="navigation-text">{tasksNavMap.get(taskPath)}</span>
        <span class="navigation-seperator">></span>
      {/each}
    {/if}
  </div>
  <div class="task-container">
    <div class="tq-checkbox-wrapper">
      <Checkbox bind:checked={td.completed} disabled={false} />
    </div>
    <div
      class="task-input-container {isInputActive
        ? 'task-input-container-active'
        : ''}"
    >
      <textarea
        class="task-input"
        rows="1"
        placeholder="Task name"
        type="text"
        bind:value={draftTaskName}
        on:click={textareaOnClick}
      />

      <textarea
        class="task-input-description 
        {isInputActive ? 'task-input-description-focus' : ''}"
        rows="1"
        use:textareaResize
        placeholder="Description"
        type="text"
        bind:value={draftDescription}
        on:click={textareaOnClick}
      />
    </div>
  </div>
  <div class="primary-btn-wrapper">
    <button
      disabled={!isInputBtnEnabled}
      class="mod-cta 
      {isInputActive ? '' : 'hidden'} 
      {isInputBtnEnabled ? '' : 'disabled-btn'}"
      on:click={saveDraft}>Save</button
    >
  </div>
  <TaskDetailsSubtaskSection bind:td {mode} />
</div>

<style>
  .task-navigation {
    min-height: 56px;
  }

  .navigation-text:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .navigation-seperator {
    padding: 0 4px;
  }

  .tq-checkbox-wrapper {
    margin-top: 8px;
  }

  .primary-btn-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  .task-input {
    /* white-space: pre; */
    border: none;
    border-bottom: 1px solid var(--dark2-blue-gray);
    margin: 0 12px;
    padding: 12px 0;
    font-size: 1.25rem;
    font-weight: 700;
    width: 100%;
    overflow: hidden;
    background-color: transparent;
  }

  .task-input-description {
    border: none;
    padding: 12px 12px 0;

    background-color: transparent;
  }

  .task-input-description-focus {
    padding-bottom: 12px;
  }

  .task-input::placeholder {
    border: none;
    color: var(--dark-blue-gray);
    font-size: 1rem;
    font-weight: normal;
  }

  .task-input-description::placeholder {
    border: none;
    color: var(--dark-blue-gray);
  }

  .task-input-container-active {
    border: 1px solid var(--dark-blue-gray);
    border-radius: 10px;
  }

  .task-input-container {
    margin-left: 12px;
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

  .task-mark {
    width: 28px;
    margin-top: 8px;
    height: 28px;
    border-radius: 100px;
    border: 1.5px solid var(--mid-blue-gray);
  }

  .main-task-panel {
    background-color: var(--background-nav);

    width: 70%;
    padding: 24px 24px;
  }
</style>
