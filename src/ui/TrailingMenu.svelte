<script lang="ts">
  import { externalLink } from '../graphics';
  import type { TaskDetails } from '../task-details';
  import TimerOpenBtn from './TimerOpenBtn.svelte';

  export let showTrailingMenu: boolean;
  export let showTimerOpenBtn: boolean;
  export let td: TaskDetails;
  const showPomodoroTaskView = async () => {
    await td.plugin.activatePomodoroTaskView(td);
    td.close()
  };

  const viewSource = () => {
    if (td.file) {
      let leaf = td.plugin.app.workspace.activeLeaf;
      if (leaf.getViewState().pinned) {
        leaf = td.plugin.app.workspace.createLeafBySplit(leaf);
      }
      leaf.openFile(td.file);
    }
  };
</script>

{#if showTrailingMenu}
  <span class="trailing-menu">
    {#if showTimerOpenBtn}
      <TimerOpenBtn on:click={showPomodoroTaskView} />
    {/if}
    <span class="trailing-menu-item" on:click={viewSource}>
      {@html externalLink}
    </span>
  </span>
{/if}

<style>
  .trailing-menu {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 4px 12px;
    height: 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  :global(.main-task-panel .trailing-menu){
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--background-nav) 10%,
      var(--background-nav)
    );
  }

  :global(.query-tasks-list .trailing-menu){
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--background-secondary) 10%,
      var(--background-secondary)
    );
  }

  .trailing-menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
  }

  .trailing-menu-item:hover {
    cursor: pointer;
  }

  :global(.trailing-menu-item > .external-link-icon) {
    height: 24px;
    width: auto;
  }

  :global(.trailing-menu-item > .external-link-icon path) {
    fill: var(--mid2-blue-gray);
  }

</style>
