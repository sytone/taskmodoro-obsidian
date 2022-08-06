<script lang="ts">
  import { TaskDetails } from '../../TaskDetails';
  import { TaskDetailsMode } from '../../Enums/component-context';
  import TaskTile from '../TaskTile/TaskTile.svelte';
  import { TaskListTileParent as TaskTileParent } from '../../Enums/component-context';
  import type { TFile } from 'obsidian';
  import SubtasksExpansionBtn from '../TaskTile/SubtasksExpansionBtn.svelte';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let subtaskName: string = '';
  let subtaskInputEl: HTMLElement;
  let allowFocus = false



  const addSubtask = () => {
    if (subtaskName.match(/[\w\d]/g)) {
      let subtask = new TaskDetails(td.plugin);
      subtaskName = subtaskName.replace(/(\n)+/g, '');
      subtask.taskName = subtaskName;
      subtaskName = '';
      subtaskInputEl.innerHTML = '';
      td.subtasks.push(subtask);
      td=td
      if (mode === TaskDetailsMode.Update) {
        storeSubtask(subtask);
      }
    }
  };

  const storeSubtask = (subtask: TaskDetails) => {
    subtask.create().then((fileName) => {
      const tasksDir = td.plugin.fileInterface.tasksDir;
      const path = `${tasksDir}/${fileName}`;
      const file = td.plugin.app.metadataCache.getFirstLinkpathDest(path, '/');
      if (file) {
        subtask.file = file;
        updateParentChildTaskFm(file);
      }
    });
  };

  const onEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSubtask();
    }
  };

  const updateParentChildTaskFm = (subtaskFile: TFile) => {
    td.plugin.fileInterface.updateFMProp(
      subtaskFile,
      td.file.name,
      'parents',
      true,
    );

    td.plugin.fileInterface.updateFMProp(
      td.file,
      subtaskFile.name,
      'subtasks',
      true,
    );
  };

  /**
   * When modal is first opened in update mode, this elements gets focus. We prevent this behaviour
  */
  const preventInitialFocus = ()=>{
    if(!allowFocus){
      subtaskInputEl.blur()
    }
  }

  const onSubtaskNameInput = (event: any) => {
    subtaskName = event.target.innerText;
  };
  let showExpansionBtn = true;
  let expanded = true;
</script>

<div class="subtask-section">
  <div class="subtask-section-title-wrapper">
    <SubtasksExpansionBtn {showExpansionBtn} bind:expanded />
    <span class="subtask-section-title">Subtasks</span>
  </div>
  {#if expanded}
    <div class="subtask-section-body">
      <div class="subtask-input-wrapper">
        <div
          class="subtask-name-input"
          placeholder="Add a subtask"
          prefix=""
          contenteditable="true"
          on:click={()=>{allowFocus = true}}
          on:focus={preventInitialFocus}
          on:input={onSubtaskNameInput}
          bind:this={subtaskInputEl}
          on:keypress={onEnter}
          
        />
      </div>
      <div class="subtasks-list">
        {#each td.subtasks as subtask (subtask.taskName)}
          <TaskTile
            parentComponent={TaskTileParent.TaskDetailsMainPanel}
            bind:td={subtask}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .subtask-section {
    margin-left: 12px;
  }

  [contenteditable='true']:empty:before {
    content: attr(prefix);
    font-size: 1.5rem;
    color: var(--placeholder);
  }

  .subtask-section-title {
    /* margin-left: 16px; */
    color: var(--title);
  }

  .subtask-section-title-wrapper {
    display: flex;
    flex-direction: row;
  }

  .subtask-name-input {
    border: none;
    border-bottom: 1px solid var(--input-border);
    margin: 0px 16px -8px 20px;
    padding: 12px 0;
    font-size: 1.25rem;
    font-weight: 700;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    background-color: transparent;
  }

  /* :global(.subtask-input-wrapper .plus-icon) {
    margin-left: 3px;
    margin-top: 8px;
  }

  :global(.subtask-input-wrapper .plus-icon rect) {
    fill: var(--secondary-action-item);
  } */

  .subtasks-list {
    margin-top: 24px;
    /* margin-left: 36px; */
  }

  .subtask-input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
