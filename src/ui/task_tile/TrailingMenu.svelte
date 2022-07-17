<script lang="ts">
  import ViewSourceBtn from './../ViewSourceBtn.svelte';
  import { externalLink } from '../../graphics';
  import type { TaskDetails } from '../../task-details';
  import TimerOpenBtn from '../TimerOpenBtn.svelte';

  export let showTrailingMenu: boolean;
  export let showTimerOpenBtn: boolean;
  export let td: TaskDetails;
  const showPomodoroTaskView = async () => {
    await td.plugin.activatePomodoroTaskView(td);
    td.close();
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
      <span class="trailing-menu-item">
        <TimerOpenBtn on:click={showPomodoroTaskView} />
      </span>
    {/if}
    <ViewSourceBtn
      file={td.file}
      classes="trailing-menu-item"
      plugin={td.plugin}
      close={td.close}
    />
    <!-- <span class="trailing-menu-item" on:click={viewSource}>
      {@html externalLink}
    </span> -->
  </span>
{/if}

<style>
  .trailing-menu {
    position: absolute;
    right: 4px;
    padding-right: 4px;
    padding-left: 4px;
    height: 2.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  :global(.timer-task-container .trailing-menu) {
    top: 2px;
    background: linear-gradient(to right, transparent 0%, #202327 20%, #202327);
  }

  :global(.main-task-panel .trailing-menu) {
    top: -8px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--background-nav) 20%,
      var(--background-nav)
    );
  }

  :global(.main-task-panel .nested-subtasks-list .trailing-menu) {
    top: -8px;
  }

  :global(.query-tasks-list .trailing-menu) {
    top: 4px;
    right: 8px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--background-secondary) 20%,
      var(--background-secondary)
    );
  }

  :global(.query-tasks-list .nested-subtasks-list .trailing-menu) {
    top: 0px;
    right: 0px;
  }

  :global(.trailing-menu-item) {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
    padding-bottom: 2px;
  }

</style>
