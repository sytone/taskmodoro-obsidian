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

<div class="checkbox-circle {disabled ? 'checkbox-disabled' : ''}"
  on:click={toggle}
>
  {#if checked}
    <div class="check-mark-wrapper">
      {@html checkMark}
    </div>
  {/if}
</div>

<style>
  .checkbox-circle {
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-disabled {
    border-color: var(--dark-blue-gray);
  }

  .checkbox-disabled:hover {
    cursor: default;
  }

  .check-mark-wrapper {
    margin: 2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  :global(.check-mark-icon) {
    stroke: var(--mid-blue-gray);
    fill: var(--mid-blue-gray);
  }

  /* query-tasks-list AND sidebar-timer-task-view */

  :global(.query-tasks-list .check-mark-icon, .timer-task-container
      .check-mark-icon) {
    width: 10px;
    height: auto;
    stroke-width: 10%;
  }

  :global(.query-tasks-list .checkbox-circle, .timer-task-container
      .checkbox-circle) {
    width: 20px;
    height: 20px;
    border: 1.5px solid var(--mid-blue-gray);
  }

  /* main-task-panel */

  :global(.main-task-panel .check-mark-icon) {
    width: 12px;
    height: auto;
    stroke-width: 7%;
  }

  :global(.main-task-panel .checkbox-circle) {
    width: 24px;
    height: 24px;
    border: 1.5px solid var(--mid-blue-gray);
  }
</style>
