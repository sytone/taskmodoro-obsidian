<script lang="ts">
  import { TaskDetails } from '../../task-details';
  import { TaskDetailsMode } from '../../enums/component-context';
  import { plus } from '../../graphics';
  import TaskTile from '../TaskTile.svelte';
  import { TaskListTileParent as TaskTileParent } from '../../enums/component-context';
  import { TFile } from 'obsidian';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let subtaskName: string = '';
  let subtaskInputEl: HTMLElement;

  const addSubtask = () => {
    if (subtaskName.match(/[\w\d]/g)) {
      let subtask = new TaskDetails(td.plugin);
      subtaskName = subtaskName.replace(/(\n)+/g, '');
      subtask.taskName = subtaskName;
      subtaskName = '';
      subtaskInputEl.innerHTML = '';
      td.subtasks.push(subtask);
      if (mode === TaskDetailsMode.Update) {
        storeSubtask(subtask);
      } else {
        td = td;
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
      false
    );

    td.plugin.fileInterface.updateFMProp(
      td.file,
      subtaskFile.name,
      'subtasks',
      true,
    );
  };

  const onSubtaskNameInput = (event: any) => {
    subtaskName = event.target.innerText;
  };
</script>

<div class="subtask-input-wrapper">
  <span on:click={addSubtask} class="plus-icon-wrapper">
    {@html plus}
  </span>
  <div
    class="subtask-name-input"
    placeholder="Add a subtask"
    contenteditable="true"
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
      view={null}
    />
  {/each}
</div>

<style>
  [contenteditable='true']:empty:before {
    content: attr(placeholder);
    color: var(--dark-blue-gray);
    font-size: 1rem;
    font-weight: normal;
  }

  .subtask-name-input {
    border: none;
    border-bottom: 1px solid var(--dark2-blue-gray);
    margin: 0 16px;
    padding: 12px 0;
    font-size: 1.25rem;
    font-weight: 700;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    background-color: transparent;
  }

  :global(.subtask-input-wrapper .plus-icon) {
    margin-left: 3px;
    margin-top: 8px;
   
  
  }
  :global(.subtask-input-wrapper .plus-icon rect) {
    fill: var(--mid3-blue-gray);
  
  }

  .subtasks-list {
    margin-top: 32px;
  }

  .subtask-input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
