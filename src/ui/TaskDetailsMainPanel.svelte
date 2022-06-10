<script lang="ts">
  export let taskName: string;
  export let description: string;

  let draftTaskName= taskName;
  let draftDescription= description;

  let isInputActive = true;
  let isInputBtnEnabled = true;
  $: isInputBtnEnabled = draftTaskName != '';

  function saveDraft() {
    taskName= draftTaskName
    description=draftDescription
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
</script>

<div class="main-task-panel">
  <div style="height: 56px" />
  <div class="task-container">
    <div class="task-mark" />
    <div
      class="task-input-container {isInputActive
        ? 'task-input-container-active'
        : ''}"
    >
      <textarea
        class="task-input-name"
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
</div>

<style>
  .primary-btn-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: end;
  }
  .task-input-name {
    border: none;
    border-bottom: 1px solid var(--dark2-blue-gray);
    margin: 0 12px;
    padding: 12px 0;
    font-size: 1.5rem;
    font-weight: 700;
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

  .task-input-name::placeholder {
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
    background-color: var(--background-nav) !important;

    width: 70%;
    padding: 24px 24px;
  }
</style>
