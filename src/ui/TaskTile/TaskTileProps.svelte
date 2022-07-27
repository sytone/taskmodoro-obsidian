<script lang="ts">
  import type { TaskDetails } from '../../TaskDetails';
  import { durationFormat } from '../../Helpers/Helpers';
  import {
    RepeatPickerModal,
    DatePickerModal,
    DurationPickerModal,
  } from '../../Modals';
  import type { Moment } from 'moment';
  import type { Duration } from 'moment';
  import { calendar, hourglass, repeat, timer } from '../../Graphics';
  import { DurationPickerType } from '../../Enums/duration-picker-type';
  import { onMount } from 'svelte';
  import { Render } from '../../Helpers/Render';
  export let td: TaskDetails;

  let showWorktimeProp: boolean;
  let showEstWorktimeProp: boolean;
  let tagsEl: HTMLElement[] = [];
  let cleanedTags = td.cleanTags(td.tags);

  $: {
    showEstWorktimeProp = td.estWorktime && td.estWorktime.asMinutes() !== 0;
    let showSpentWorktimeProp =
      td.spentWorktime && td.spentWorktime.asMinutes() !== 0;
    showWorktimeProp = showSpentWorktimeProp || showEstWorktimeProp;
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

  const showDuePicker = () => {
    new DatePickerModal(
      td.plugin.app,
      window.moment(td.due),
      'Due date',
      (newDueDate: Moment) => {
        if (td.file) {
          td.plugin.fileInterface.updateFMProp(td.file, newDueDate, 'due');
        }
      },
    ).open();
  };

  const showSchedulePicker = () => {
    new DatePickerModal(
      td.plugin.app,
      window.moment(td.due),
      'Schedule date',
      (newScheduledDate: Moment) => {
        if (td.file) {
          td.plugin.fileInterface.updateFMProp(
            td.file,
            newScheduledDate,
            'scheduled',
          );
        }
      },
    ).open();
  };

  const showRepeatPicker = () => {
    new RepeatPickerModal(
      td.plugin.app,
      td.recurringConfig,
      (newRepeatConfig: string) => {
        if (td.file) {
          td.plugin.fileInterface.updateFMProp(
            td.file,
            newRepeatConfig,
            'repeat',
          );
        }
      },
    ).open();
  };

  const showEstWorktimePicker = () => {
    const onSet = (estWorktime: Duration) => {
      if (td.file) {
        td.plugin.fileInterface.updateFMProp(
          td.file,
          {
            minutes: estWorktime.asMinutes(),
          },
          'estimated_worktime',
        );
      }
    };

    new DurationPickerModal(
      td.plugin.app,
      'Estimated worktime',
      td.estWorktime,
      DurationPickerType.EstimatedWorktime,
      onSet,
    ).open();
  };
</script>

<div class="props-container">
  {#if showWorktimeProp}
    <span class="prop">
      <span id="spent-worktime-container" class="prop">
        {@html timer}
        <span class="prop-text" id="spent-worktime"
          >{durationFormat(td.spentWorktime)}</span
        >
      </span>
      {#if showEstWorktimeProp}
        <span id="worktime-seperator"> / </span>
        <span
          on:click={showEstWorktimePicker}
          id="est-worktime-container"
          class="prop"
        >
          {@html timer}
          <span class="prop-text" id="est-worktime"
            >{durationFormat(td.estWorktime)}</span
          >
        </span>
      {/if}
    </span>
  {/if}
  {#if td.due && td.due !== ''}
    <span class="prop" on:click={showDuePicker}>
      {@html calendar}
      <span class="prop-text" id="due">{td.due?.format('YYYY-MM-DD')}</span>
    </span>
  {/if}
  {#if td.scheduled && td.scheduled !== ''}
    <span class="prop" on:click={showSchedulePicker}>
      {@html hourglass}
      <span class="prop-text" id="scheduled"
        >{td.scheduled?.format('YYYY-MM-DD')}</span
      >
    </span>
  {/if}
  {#if td.recurringConfig && td.recurringConfig !== ''}
    <span class="prop" on:click={showRepeatPicker}>
      {@html repeat}
      <span class="prop-text" id="repeat">{td.recurringConfig?.toLowerCase()}</span
      >
    </span>
  {/if}
  {#if cleanedTags.length !== 0}
    {#each cleanedTags as tag, i (tag+i)}
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
    padding-top:2px;
    padding-bottom:4px;
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

  :global(#spent-worktime-container > .timer-icon path) {
    fill: #b63737;
  }

  :global(#est-worktime-container > .timer-icon path) {
    fill: #b63737;
    opacity: 0.7;
    /* fill: #A58F8E; */
  }

  #est-worktime-container {
    margin-right: 0px;
  }

  #spent-worktime-container {
    margin-right: 0px;
    cursor: default;
  }

  #worktime-seperator {
    opacity: 0.5;
    margin-left: 8px;
  }

  #repeat {
    color: #c86092;
  }

  #due {
    color: #8562cb;
  }

  #spent-worktime {
    color: #b63737;
  }

  #est-worktime {
    color: #b63737;
    opacity: 0.7;
  }

  #scheduled {
    color: #54a8b4;
  }
</style>
