<script lang="ts">
  import { TaskDetails } from '../../task-details';
  import { TaskDetailsMode } from '../../enums/component-context';
  import Checkbox from './../Checkbox.svelte';
  import { plus } from '../../graphics';
  import TaskListTile from '../TaskTile.svelte';
  import { TaskListTileParent } from '../../enums/component-context';
  import { MarkdownRenderer, TFile, htmlToMarkdown } from 'obsidian';
  import { onMount, afterUpdate } from 'svelte';
  import Cursor from 'src/cursor';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let draftTaskName = td.taskName;
  let draftDescription = td.description;
  let isInputActive = true;
  let isInputBtnEnabled = true;
  let subtaskNameMD: string = '';
  let subtaskNameEl: HTMLElement;

  $: {
    isInputBtnEnabled = draftTaskName != '';
    renderMD(subtaskNameMD, subtaskNameEl, td.file);
  }

  function renderMD(md: string, el: HTMLElement, file: TFile) {
    if (!el) return;
    const tempEl = createDiv();
    MarkdownRenderer.renderMarkdown(md, tempEl, file ? file.path : './', null);
    let offset = Cursor.getCurrentCursorOffset(el);
    let prevLen = el.innerText.length;

    el.innerHTML =
      tempEl.children.length !== 0
        ? tempEl.children[0].innerHTML
        : tempEl.innerHTML;

    if (offset === 0 && prevLen === 0) {
      offset = el.innerText.length;
    }

    // console.log('inner-html: ', el.innerHTML, '  inner-text: ', el.innerText);
    Cursor.setCurrentCursorPosition(offset, el);
  }

  onMount(() => {
    renderMD(subtaskNameMD, subtaskNameEl, td.file);
  });

  function saveDraft() {
    td.taskName = draftTaskName;
    td.description = draftDescription;
    td = td;
    isInputActive = false;
  }

  function textareaOnClick() {
    isInputActive = true;
  }

  function resize(event: any) {
    let target = event.target;
    target.style.height = 4 + 'px';
    target.style.height = +target.scrollHeight + 'px';
  }

  function textareaResize(el: any) {
    el.addEventListener('input', resize);
    return {
      destroy: () => el.removeEventListener('input', resize),
    };
  }

  const addSubtask = () => {
    let subtask = new TaskDetails(td.plugin);
    subtaskNameMD = subtaskNameMD.replace(/(\n)+/g, '');
    subtask.taskName = subtaskNameMD;
    subtaskNameMD = '';
    td.subtasks.push(subtask);
    if (mode === TaskDetailsMode.Update) {
      storeSubtask(subtask);
    } else {
      td = td;
    }
  };

  const storeSubtask = (subtask: TaskDetails) => {
    subtask.create().then((fileName) => {
      console.log('f-created');
      const tasksDir = td.plugin.settings.TasksDir;
      const path = `${tasksDir}/${fileName}`;
      const file = td.plugin.app.metadataCache.getFirstLinkpathDest(path, '/');
      if (file) {
        subtask.file = file;
        updateSubtasksFM();
      }
    });
  };
  const onEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addSubtask();
    }
  };

  const updateSubtasksFM = () => {
    let subtasksFileNames = td.subtasks.map((s) => s.file.name);
    td.plugin.fileInterface.updateFMProp(
      td.file,
      td.plugin.app.vault,
      subtasksFileNames,
      'subtasks',
    );
  };

  // TODO: support live preview propertly
  const onSubtaskNameInput = (event: any) => {
    // let preprocHtml = event.target.innerHTML.replace(/ {2,}/g, (m: string) => m.replace(/ /g, '\u00a0'))
    // subtaskNameMD =   htmlToMarkdown(preprocHtml).replace(/\u00a0/g, ' ')
    subtaskNameMD = htmlToMarkdown(event.target.innerHTML);
  };
</script>

<div class="main-task-panel">
  <div style="height: 56px" />
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
  <div class="subtask-input-wrapper">
    <span on:click={addSubtask} class="plus-icon-wrapper">
      {@html plus}
    </span>
    <div
      id="subtask-name-input"
      class="task-input"
      rows="1"
      placeholder="Add a subtask"
      contenteditable="true"
      bind:this={subtaskNameEl}
      on:input={onSubtaskNameInput}
      on:keypress={onEnter}
    />
  </div>
  <div class="subtasks-list">
    {#each td.subtasks as subtask (subtask.taskName)}
      <TaskListTile
        parent={TaskListTileParent.TaskDetailsMainPanel}
        bind:td={subtask}
        view={null}
      />
    {/each}
  </div>
</div>

<style>
  [contenteditable='true']:empty:before {
    content: attr(placeholder);
    color: var(--dark-blue-gray);
    font-size: 1rem;
    font-weight: normal;
  }

  :global(.subtask-input-wrapper .plus-icon) {
    margin-left: 4px;
  }

  .subtasks-list {
    margin-top: 32px;
  }

  .subtask-input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
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
