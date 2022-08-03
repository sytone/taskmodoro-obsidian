<script lang="ts">
  import { cancel } from '../../Graphics';
  export let title: string;
  export let onSelect: () => void;
  export let onReset: () => void;
  export let value: string;
  let isPropInputFocus = false;
  let isResetBtnFocus = false;
</script>

<div class="group">
  <div class="label">{title}</div>
  <div class="prop-input-container">
    <div
      on:focus={() => {}}
      on:mouseover={() => {
        isPropInputFocus = true;
      }}
      on:mouseleave={() => {
        isPropInputFocus = false;
      }}
      class="prop-input"
      on:click={() => {
        if (!isResetBtnFocus) {
          onSelect();
        }
      }}
    >
      {value}
      {#if isPropInputFocus}
        <span
          class="reset"
          on:click={onReset}
          on:focus={() => {}}
          on:mouseover={() => {
            isResetBtnFocus = true;
          }}
          on:mouseleave={() => {
            isResetBtnFocus = false;
          }}
        >
          {@html cancel}
        </span>
      {/if}
    </div>
  </div>
</div>

<style>
  .prop-input-container {
    display: flex;
    flex-direction: row;
  }

  .reset {
    padding: 4px;
    position: absolute;
    right: 0px;
    top: 0px;
  }

  .reset:hover,
  .reset:focus {
    cursor: pointer;
    background-color: var(--interactive-hover);
  }

  :global(.reset svg) {
    width: 12px;
    height: 12px;    /* opacity: 0.7; */
  }
  :global(.reset rect)
  {
    fill: var(--secondary-action-item);

  }


  .group {
    padding-bottom: 24px;
  }

  .prop-input {
    position: relative;
    background-color: transparent;
    border: none;
    width: 100%;
    padding: 4px 0px;
    color: var(--text-normal);

  }

  .prop-input:hover,
  .prop-input:focus {
    cursor: pointer;
    background-color: var(--interactive-hover);
  }

  .label {
    font-size: 1rem;
    padding-bottom: 4px;
    color: var(--title);
  }
</style>
