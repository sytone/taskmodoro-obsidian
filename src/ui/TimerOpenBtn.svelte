<script lang="ts">
  import { circledPlay, play } from '../graphics';

</script>

<div on:click  class="timer-open-btn">
    {@html circledPlay}
</div>

<style>

  .timer-open-btn:hover{
    cursor:pointer
  }
  
  :global(.sidebar-refs-container .timer-open-btn  svg){
    width: 28px;
  }

  :global(.trailing-menu .timer-open-btn  svg){
    width: 26px;
  }

  :global(.timer-open-btn  svg){
    
    max-width: 100%;
    max-height: 100%;
    margin-left: 1.5px;
    height: auto;
  
  }

  :global(.timer-open-btn  path,.timer-open-btn  path){
   stroke: var(--mid2-blue-gray);
   stroke-width: 2.5px;
   fill: transparent;

  }
  :global(.trailing-menu circle,.timer-open-btn circle){
   stroke: var(--mid2-blue-gray);
   fill: transparent;
    stroke-width: 3.5px;
  }

  :global(.main-task-panel .trailing-menu .timer-open-btn){
    padding-top: 8px;
  }
  :global(.query-tasks-list .trailing-menu .timer-open-btn){
    margin-top: 11px;
  }

</style>
