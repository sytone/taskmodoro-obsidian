<script lang="ts">
  import { checkMark } from './../graphics';
  import { createEventDispatcher } from 'svelte';

  export let checked: Boolean;
  export let disabled = false;
  export let context: 'createTask' | 'listTile' = 'createTask';

  let createTaskStyle = { cbSize: '24px', cmW: '12px', cmSW: '7%' };
  let style = createTaskStyle;
  if (context === 'listTile') {
    let listTileStyle = { cbSize: '20px', cmW: '10px', cmSW: '10%' };
    style = listTileStyle;
  }
  const dispatch = createEventDispatcher();

  function toggle() {
    if (!disabled) {
      dispatch('toggle');
      checked = !checked;
    }
  }
</script>

<div
  style="--cbSize: {style.cbSize}; --cmW: {style.cmW}; --cmSW: {style.cmSW}"
  class="tq-circle {disabled ? 'checkbox-disabled' : ''}"
  on:click={toggle}
>
  {#if checked}
    <div class="checkmark-wrapper">
      {@html checkMark}
    </div>
  {/if}
</div>

<style>

  :global(.checkmark-wrapper > svg) {
    width: var(--cmW);
    height: auto;
    stroke-width: var(--cmSW);
    stroke: var(--mid-blue-gray);
    fill: var(--mid-blue-gray);
  }

  .tq-circle {
    width: var(--cbSize);
    height: var(--cbSize);
  }

  .checkbox-disabled {
    border: 2px solid var(--dark-blue-gray);

  }
  .checkbox-disabled:hover {
    cursor: default;
  }

  .checkmark-wrapper {
    margin: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
  }
</style>
