<script lang="ts">
  import { TaskDetails } from '../../task-details';
  import { TaskDetailsMode } from '../../enums/component-context';
  import Checkbox from '../Checkbox.svelte';
  import { plus } from '../../graphics';
  import TaskTile from '../TaskTile.svelte';
  import { TaskListTileParent as TaskTileParent } from '../../enums/component-context';
  import { MarkdownRenderer, TFile, htmlToMarkdown } from 'obsidian';
  import { onMount, afterUpdate } from 'svelte';
  import Cursor from 'src/cursor';
  export let td: TaskDetails;
  export let mode: TaskDetailsMode;


  let subtaskNameMD: string = '';
  let subtaskNameEl: HTMLElement;

  $: {
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

  <div class="subtask-input-wrapper">
    <span on:click={addSubtask} class="plus-icon-wrapper">
      {@html plus}
    </span>
    <div
      class="subtask-name-input"
      placeholder="Add a subtask"
      contenteditable="true"
      bind:this={subtaskNameEl}
      on:input={onSubtaskNameInput}
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

  .subtasks-list {
    margin-top: 32px;
  }

  .subtask-input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }


</style>

