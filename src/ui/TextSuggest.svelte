<script lang="ts">
  import type { App } from 'obsidian';
  import { onMount } from 'svelte';
  import { StaticSuggest } from '../suggest';
import { textareaResize } from '../helpers/textarea-resize';

  export let app: App;
  export let suggestions: string[];
  export let placeholder: string = '';
  export let value: string;
  export let classes: string = '';

  let inputEl: HTMLTextAreaElement;

  onMount(() => {
    new StaticSuggest(app, inputEl, suggestions);
  });


</script>

<textarea
  class={classes}
  type="text"
  {placeholder}
  use:textareaResize
  bind:this={inputEl}
  bind:value
/>

<style>
  .expense-payee {
    width: 100%;
  }

  .expense-category {
    flex: 1;
  }
</style>
