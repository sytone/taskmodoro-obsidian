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

  let tagsEl: HTMLElement[] = [];
  let cleanedTags = td.cleanTags(td.tags);
  const mode = TaskDetailsMode.Update;


  $: {
    cleanedTags = td.cleanTags(td.tags);
    renderTags(cleanedTags);
  }

  $: showEstWorktime = td.estWorktime && td.estWorktime.asMinutes() !== 0;
  $: showOverallWorktime =
      td.overallWorktime && td.overallWorktime.asMinutes() !== 0;
  $: showOverallWorktimeProps = showEstWorktime || showOverallWorktime 

  $: showDailyWorktime = td.dailyWorktime && td.dailyWorktime.asMinutes()  
  $: showDailyScheduledWorktime = td.dailyScheduledWorktime && td.dailyScheduledWorktime.asMinutes()!==0
  $: showDailyWorktimeProps = showDailyWorktime || showDailyScheduledWorktime
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
  {#if showOverallWorktimeProps}
    <span class="prop">
      <span id="overall-worktime-container" class="prop">
        {@html timer}
        <span class="prop-text" id="overall-worktime-text"
          >{durationFormat(td.overallWorktime)}</span
        >
      </span>
      {#if showEstWorktime}
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
  {#if showDailyWorktimeProps}
    <span class="prop">
      <span id="daily-worktime-container" class="prop">
        {@html timer}
        <span class="prop-text" id="daily-worktime-text"
          >{durationFormat(td.dailyWorktime)}</span
        >
      </span>
      {#if showDailyScheduledWorktime}
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
  {#if td.due}
    <span class="prop" on:click={() => showDueDatePicker(td, mode)}>
      {@html calendar}
      <span class="prop-text" id="due-text">{td.due?.format('YYYY-MM-DD')}</span
      >
    </span>
  {/if}
  {#if td.scheduled}
    <span class="prop" on:click={() => showScheduledDatePicker(td, mode)}>
      {@html hourglass}
      <span class="prop-text" id="scheduled-text"
        >{td.scheduled?.format('YYYY-MM-DD')}</span
      >
    </span>
  {/if}
  {#if td.recurringConfig}
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
    fill: var(--overall-worktime-prop);
  }

  :global(#est-worktime-container > .timer-icon path) {
    fill: var(--overall-worktime-prop);
    opacity: 0.7;
    /* fill: #A58F8E; */
  }

  :global(#daily-worktime-container > .timer-icon path) {
    fill:  var(--daily-worktime-prop);
  }

  :global(#daily-scheduled-worktime-container > .timer-icon path) {
    fill:  var(--daily-worktime-prop);
    opacity: 0.7;
    /* fill: #A58F8E; */
  }

  #est-worktime-container,
  #daily-scheduled-worktime-container {
    margin-right: 0px;
  }

  #overall-worktime-container,
  #daily-worktime-container {
    margin-right: 0px;
    cursor: default;
  }

  #worktime-seperator {
    opacity: 0.3;
    color:white;
    margin-left: 8px;
  }

  #repeat-text {
    color: var(--repeat-prop);
  }

  #due-text {
    color: var(--due-prop);
  }

  #overall-worktime-text {
    color: var(--overall-worktime-prop);
  }

  #est-worktime-text {
    color: var(--overall-worktime-prop);
    opacity: 0.7;
  }

  #daily-worktime-text {
    color: var(--daily-worktime-prop);
  }

  #daily-scheduled-worktime-text {
    color: var(--daily-worktime-prop);
    opacity: 0.7;
  }

  #scheduled-text {
    color: var(--scheduled-prop);
  }
</style>
