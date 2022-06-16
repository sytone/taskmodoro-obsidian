<script lang="ts">
  import { play } from '../graphics';
  export let context: 'createTask' | 'listTile' = 'createTask';

  let createTaskStyle = { size: '24px' };
  let style = createTaskStyle;
  if (context === 'listTile') {
    let listTileStyle = { size: '20px' };
    style = listTileStyle;
  }
</script>

<div on:click style="--size:{style.size};" class="tq-circle play-wrapper">
    {@html play}
</div>

<style>
  .tq-circle {
    margin-left: 8px;
    width: var(--size);
    height: var(--size);
  }

  :global(.play-wrapper > svg){
    width: 7px;
    margin-left: 1.5px;
    height: auto;
  
  }
  :global(.play-wrapper > svg>path){
    stroke-width: 1.5;
    stroke: var(--mid-blue-gray)
  
  }
</style>
