<script lang="ts">
  import { checkMark } from './../graphics';
  export let checked: Boolean;
  export let disabled = false;

  function check() {
    if (!disabled) {
      checked = !checked;
    }
  }
</script>

<div class="tq-checkbox {disabled ? 'checkbox-disabled' : ''}" on:click={check}>
  {#if checked}
    <div>
      {@html checkMark}
    </div>
  {/if}
</div>

<style>
  .tq-checkbox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    width: 28px;
    margin-top: 8px;
    height: 28px;
    border-radius: 100px;
    border: 1.5px solid var(--mid-blue-gray);
  }

  .tq-checkbox:hover {
    cursor: pointer;
  }

  .checkbox-disabled {
    border: 1.5px solid var(--dark-blue-gray);
  }
  .checkbox-disabled:hover {
    cursor: default;
  }
</style>
