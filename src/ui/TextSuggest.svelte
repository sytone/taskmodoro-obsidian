<script lang="ts">
  import type { App } from 'obsidian';
  import { afterUpdate, onMount } from 'svelte';
  import { StaticSuggest } from '../suggest';
  import { textareaResize } from '../helpers/textarea-resize';
  import { Render } from '../helpers/render';

  export let app: App;
  export let suggestions: string[];
  export let placeholder: string = '';
  export let value: string;
  export let classes: string = '';
  export let onFocusout = () => {};
  let inputEl: HTMLElement;
  let draftValue = value;
  $: {
    draftValue=value
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
    if (event.key === 'Enter') {
      event.preventDefault();
      window.getSelection().removeAllRanges();
    }
  };
</script>

<div
  contenteditable="true"
  class={classes}
  type="text"
  {placeholder}
  bind:this={inputEl}
  on:input={onInput}
  on:keypress={onEnter}
  on:focusout={() => {
    if(value !== draftValue){
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
