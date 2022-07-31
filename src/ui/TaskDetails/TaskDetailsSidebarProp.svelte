<script lang="ts">
export let title: string
export let onSelect: ()=>void
export let value: string
</script>
<div class="group">
    <div class="label">{title}</div>
    <div
      class="prop-input"
      on:click={onSelect}
    >
      {value}
    </div>
  </div>
<style>
  .group {
    padding-bottom: 24px;
  }

  .prop-input {
    background-color: transparent;
    border: none;
    width: 100%;
    padding: 0 0;
  }

  .prop-input:hover,
  .prop-input:focus {
    cursor: pointer;
    background-color: #1b1e20;
  }

  .label {
    font-size: 1rem;
    padding-bottom: 8px;
    color: var(--mid-blue-gray);
  }
</style>