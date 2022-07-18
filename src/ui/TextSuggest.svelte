<script lang="ts">
  import type { App } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import { get_current_component } from 'svelte/internal';

  import { StaticSuggest } from '../suggest';
  import { textareaResize } from '../helpers/textarea-resize';
  import { Render } from '../helpers/render';
  import { log } from 'console';

  export let app: App;
  export let suggestions: string[];
  export let placeholder: string = '';
  export let value: string;
  export let classes: string = '';
  export let onFocusout = () => {};
  let inputEl: HTMLElement;
  let draftValue = value;
  $: {
    handleDisplay(value);
  }

  onMount(() => {
    new StaticSuggest(app, inputEl, suggestions);
    handleDisplay(value);
  });

  const handleDisplay = (value: string) => {
    if (!inputEl) return;
    if (inputEl != document.activeElement) {
      Render.renderMD(value, inputEl);
    } else {
      Render.displayMD(value, inputEl);
    }
  };

  const onInput = (event: any) => {
    
    draftValue = event.target.innerText;
  };

  const onEnter = (event: KeyboardEvent) => {
    // event.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  const onKeyup = (event: any) => {
    console.log(event);
    if (event.key === 'Enter') {
      draftValue = Render.removeNewline(event.target.innerText);
      onEnter(event);
    } else {
      draftValue = event.target.innerText;
    }
  };
</script>

<div
  contenteditable="true"
  class={classes}
  type="text"
  {placeholder}
  bind:this={inputEl}
  on:keyup={onKeyup}
  on:input={onInput}
  on:focusout={() => {
    console.log('focusout');
    if (value !== draftValue) {
      value = draftValue;
      onFocusout();
    }
    Render.renderMD(value, inputEl);
  }}
  on:focusin={() => {
    Render.displayMD(value, inputEl);
  }}
/>

<style>
  .expense-payee {
    width: 100%;
  }

  .expense-category {
    flex: 1;
  }
</style>
