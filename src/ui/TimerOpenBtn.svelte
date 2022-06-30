<script lang="ts">
  import { play } from '../graphics';

</script>

<div on:click  class="tq-circle play-circle">
    {@html play}
</div>

<style>

  :global(.play-circle > svg){
    width: 7px;
    width: 8px;
    margin-left: 1.5px;
    height: auto;
  
  }
  :global(.play-circle > svg>path){
    stroke-width: 1.5;
    stroke: var(--mid-blue-gray)
  
  }
</style>
