<script lang="ts">
  import type { TaskDetails } from '../../TaskDetails';
  import { durationFormat } from '../../Helpers/Helpers';
  import { calendar, hourglass, repeat, timer } from '../../Graphics';
  import { onMount } from 'svelte';
  import { Render } from '../../Helpers/Render';
  import { TaskDetailsMode } from '../../Enums/component-context';
import { showDailyScheduleWorktimePicker } from '../../Helpers/ShowPickers';
  import {
    showScheduledDatePicker,
    showRepeatPicker,
  } from '../../Helpers/ShowPickers';
  import {
    showEstWorktimePicker,
    showDueDatePicker,
  } from '../../Helpers/ShowPickers';
  export let td: TaskDetails;

  let showWorktimeProp: boolean;
  let showEstWorktimeProp: boolean;
  let tagsEl: HTMLElement[] = [];
  let cleanedTags = td.cleanTags(td.tags);
  const mode = TaskDetailsMode.Update;
  $: {
    showEstWorktimeProp = td.estWorktime && td.estWorktime.asMinutes() !== 0;
    let showOverallWorktimeProp =
      td.overallWorktime && td.overallWorktime.asMinutes() !== 0;
    showWorktimeProp = showOverallWorktimeProp || showEstWorktimeProp;
    cleanedTags = td.cleanTags(td.tags);
    renderTags(cleanedTags);
  }

  onMount(() => {
    renderTags(cleanedTags);
  });

  const renderTags = (tags: string[]) => {
    for (let i = 0; i < tagsEl.length; i++) {
      Render.renderMD(tags[i], tagsEl[i], td.file);
    }
  };
</script>

<div class="props-container">
  {#if showWorktimeProp}
    <span class="prop">
      <span id="overall-worktime-container" class="prop">
        {@html timer}
        <span class="prop-text" id="spent-worktime-text"
          >{durationFormat(td.overallWorktime)}</span
        >
      </span>
      {#if showEstWorktimeProp}
        <span id="worktime-seperator"> / </span>
        <span
          on:click={() => showEstWorktimePicker(td, mode)}
          id="est-worktime-container"
          class="prop"
        >
          {@html timer}
          <span class="prop-text" id="est-worktime-text"
            >{durationFormat(td.estWorktime)}</span
          >
        </span>
      {/if}
    </span>

  {/if}
  {#if td.dailyWorktime || td.dailyScheduledWorktime}
  <span class="prop">
    <span id="daily-worktime-container" class="prop">
      {@html timer}
      <span class="prop-text" id="daily-worktime-text"
        >{durationFormat(td.dailyWorktime)}</span
      >
    </span>
    {#if td.dailyScheduledWorktime}
      <span id="worktime-seperator"> / </span>
      <span
        on:click={() => showDailyScheduleWorktimePicker(td, mode)}
        id="daily-scheduled-worktime-container"
        class="prop"
      >
        {@html timer}
        <span class="prop-text" id="daily-scheduled-worktime-text"
          >{durationFormat(td.dailyScheduledWorktime)}</span
        >
      </span>
    {/if}
  </span>
  {/if}
  {#if td.due && td.due !== ''}
    <span class="prop" on:click={() => showDueDatePicker(td, mode)}>
      {@html calendar}
      <span class="prop-text" id="due-text">{td.due?.format('YYYY-MM-DD')}</span>
    </span>
  {/if}
  {#if td.scheduled && td.scheduled !== ''}
    <span class="prop" on:click={() => showScheduledDatePicker(td, mode)}>
      {@html hourglass}
      <span class="prop-text" id="scheduled-text"
        >{td.scheduled?.format('YYYY-MM-DD')}</span
      >
    </span>
  {/if}
  {#if td.recurringConfig && td.recurringConfig !== ''}
    <span class="prop" on:click={() => showRepeatPicker(td, mode)}>
      {@html repeat}
      <span class="prop-text" id="repeat-text"
        >{td.recurringConfig?.toLowerCase()}</span
      >
    </span>
  {/if}
  {#if cleanedTags.length !== 0}
    {#each cleanedTags as tag, i (tag + i)}
      <span id="task-tag" bind:this={tagsEl[i]} class="prop" />
    {/each}
  {/if}
</div>

<style>
  .props-container {
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    padding-top: 2px;
    padding-bottom: 4px;
    row-gap: 8px;
  }

  .prop {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 8px;
  }

  .prop > span.prop:first-child {
    margin-left: 0px;
  }

  .prop:hover {
    cursor: pointer;
  }

  .prop-text {
    padding-left: 4px;
  }

  :global(.repeat-icon, .timer-icon) {
    width: 16px;
    min-width: 16px;
    height: auto;
  }

  :global(#overall-worktime-container > .timer-icon path) {
    fill: #b63737;
  }

  :global(#est-worktime-container > .timer-icon path) {
    fill: #b63737;
    opacity: 0.7;
    /* fill: #A58F8E; */
  }

  :global(#daily-worktime-container > .timer-icon path) {
    fill: #c86092;
  }

  :global(#daily-scheduled-worktime-container > .timer-icon path) {
    fill: #c86092;
    opacity: 0.7;
    /* fill: #A58F8E; */
  }

  #est-worktime-container, #daily-scheduled-worktime-container  {
    margin-right: 0px;
  }

  #overall-worktime-container, #daily-worktime-container {
    margin-right: 0px;
    cursor: default;
  }

  #worktime-seperator {
    opacity: 0.5;
    margin-left: 8px;
  }

  #repeat-text {
    color: #c86092;
  }

  #due-text {
    color: #8562cb;
  }

  #spent-worktime-text {
    color: #b63737;
  }

  #est-worktime-text {
    color: #b63737;
    opacity: 0.7;
  }

  #daily-worktime-text {
    color: #c86092;
  }

  #daily-scheduled-worktime-text {
    color: #c86092;
    opacity: 0.7;
  }

  #scheduled-text {
    color: #54a8b4;
  }
</style>
