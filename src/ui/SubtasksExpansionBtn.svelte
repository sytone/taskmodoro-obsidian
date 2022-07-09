<script lang="ts">
  import exp from 'constants';

  import { chevronDown } from '../graphics';

  export let showExpansionBtn: boolean;
  export let expanded: boolean;
  const onClick = () => {
    expanded = !expanded;
  };
  let classes = ''
  if(expanded){

  }
</script>

<div on:click={onClick} class="chevron-wrapper">
  {#if showExpansionBtn}
  <div class="transition contracted {expanded?'expanded':''}">
    {@html chevronDown}
  </div>
  {/if}
</div>

<style>
  .transition{
    transition-duration: 0.1s;
    transition-property: transform;
  }
  .contracted{
    transform: rotate(-90deg);
  }
  .expanded{
    transform: rotate(0deg);
  }

  :global(.subtask-section-title-wrapper .chevron-down-icon, .subtasks-list
      .chevron-down-icon) {
    width: 12px;
  }

  :global(.subtask-section-title-wrapper .chevron-wrapper, .subtasks-list
      .chevron-wrapper) {
    margin-top: 8px;
    margin-right: 12px;
    margin-left: 12px;
    width: 12px;
  }

  :global(.subtask-section-title-wrapper .chevron-wrapper) {
    margin-top: 2px;
  }

  :global(.subtask-section-title-wrapper .chevron-down-icon path, .subtasks-list
      .chevron-down-icon
      path) {
    fill: var(--mid3-blue-gray);
  }
</style>
