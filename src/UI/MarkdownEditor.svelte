<!-- Author: Matthew Meyers -->
<script lang="ts">
  import {
    autoPairBracketsCommands,
    autoPairMarkdownCommands,
    handleNewLine,
    handleTab,
    unpairBrackets,
    unpairMarkdown,
  } from '../Editor/Commands';

  import { Platform } from 'obsidian';
  import { onMount } from 'svelte';

  export let onEnter: () => void;
  export let onFocusout: () => void;
  export let placeholder: string;
  export let md = '';
  export let id = '';
  let textAreaEl: HTMLTextAreaElement;
  const shouldAutoPairMarkdown = true;
  const shouldAutoPairBrackets = true;
  const shouldUseTab = true;
  const tabWidth = 4;
  const shouldUseMarkdownLinks = true;

  onMount(()=>{
    textAreaEl.focus()
  })

  const allowNewLine = (e: KeyboardEvent): boolean => {
    if (Platform.isMobile) {
      return e.key === 'Enter' && true;
    }

    if (e.key === 'Enter' && e.shiftKey) {
      return true;
    } else if (e.key === 'Enter') {
      onEnter();
      return false;
    }
    return false;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      const handledBrackets = unpairBrackets(e.target as HTMLTextAreaElement);
      if (handledBrackets) return handledBrackets;

      return unpairMarkdown(e.target as HTMLTextAreaElement);
    }

    if (allowNewLine(e)) {
      const handled = handleNewLine(e.target as HTMLTextAreaElement);
      if (handled) {
        e.preventDefault();
        return handled;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();

      return handleTab(
        e.target as HTMLTextAreaElement,
        e.shiftKey,
        shouldUseTab,
        tabWidth,
      );
    }

    if (shouldAutoPairMarkdown) {
      const command = autoPairMarkdownCommands[e.key];
      if (command) {
        const handled = command(e.target as HTMLTextAreaElement);
        if (handled) {
          e.preventDefault();
          return true;
        }
      }
    }

    if (shouldAutoPairBrackets) {
      if (shouldUseMarkdownLinks && e.key === '[') {
        return false;
      }

      const command = autoPairBracketsCommands[e.key];
      if (command) {
        const handled = command(e.target as HTMLTextAreaElement);
        if (handled) {
          e.preventDefault();
          return true;
        }
      }
    }

    return false;
  };

  $: {
    if (textAreaEl) {
      md = textAreaEl.value;
    }
  }
</script>

<!-- Reproduced from: https://github.com/mgmeyers/obsidian-kanban -->

<div class="taskmodoro__markdown-Editor" {id}>
  <div data-replicated-value={md} class="grow-wrap">
    <textarea
      bind:value={md}
      on:keydown={onKeyDown}
      on:focusout={onFocusout}
      {placeholder}
      bind:this={textAreaEl}
      rows={1}
      class="item-input"
    />
  </div>
</div>

<style>
  .grow-wrap {
    width: 100%;
    display: grid;
  }
  .grow-wrap::after {
    content: attr(data-replicated-value) ' ';
    white-space: pre-wrap;
    visibility: hidden;
  }
  .grow-wrap > textarea {
    resize: none;
    overflow: hidden;
    tab-size: 2;
  }

  .grow-wrap > textarea:focus {
    border-color: var(--interactive-accent);
  }

  .grow-wrap > textarea,
  .grow-wrap::after {
    /* Identical styling required! */
    background-color: var(--background-modifier-form-field);
    border: 1px solid var(--background-modifier-border);
    color: var(--text-normal);
    padding: 8px 8px;
    font: inherit;
    line-height: 1.5;
    grid-area: 1 / 1 / 2 / 2;
    font-size: 1rem;
    overflow: hidden;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  .grow-wrap > textarea::placeholder {
    color: var(--placeholder);
    font-size: 1rem;
    font-weight: normal;
  }
</style>
