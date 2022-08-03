<script lang="ts">
  import MarkdownEditor from './MarkdownEditor.svelte';
  export let text: string;
  export let placeholder: string;
  export let displayContainerId: string = '';
  export let editContainerId: string = '';
  export let onClick: () => void;
  export let showEditor: boolean;
  export let onEnter: () => void;
  export let onFocusout: () => void;
  export let displayEl: HTMLElement;
</script>

{#if showEditor}
  <MarkdownEditor
    {placeholder}
    id={editContainerId}
    {onEnter}
    {onFocusout}
    bind:md={text}
  />
{:else}
  <div class="markdown-preview__wrapper">
    <div
      class="markdown-preview"
      bind:this={displayEl}
      on:click={onClick}
      id={displayContainerId}
    />
    {#if text === ''}
      <span class="editor__placeholder">{placeholder}</span>
    {/if}
  </div>
{/if}

<style>
  .markdown-preview__wrapper {
    position: relative;
  }

  .markdown-preview {
    min-height: 3rem;
  }

  .editor__placeholder {
    position: absolute;
    top: 8px;
    left: 0px;
  }

  #task-input__name {
    border: none;
    border-bottom: 1px solid var(--input-border);
    width: 100%;
    overflow: hidden;
    background-color: transparent;
  }

  :global(#task-input__name p) {
    margin: 0;
  }

  :global(#task-input__name) {
    font-size: 1.25rem;
    line-height: 1.5;
    font-weight: 700;
    padding: 8px 0;
  }

  .editor__placeholder {
    color: var(--placeholder);
    font-size: 1rem;
    font-weight: normal;
  }

  #task-input__description {
    border: none;
    padding: 8px 0;
    background-color: transparent;
  }
</style>
