<script lang="ts">
import type { TaskDetails } from '../task-details';
import { durationFormat_hm } from '../util';
import { RepeatPickerModal, DatePickerModal } from '../modals';
import type { Moment} from 'moment';
import {
    calendar,
    hourglass,
    repeat,
    timer,
  } from '../graphics';

export let td: TaskDetails

let showWorktimeGroup: boolean;
  let showEstWorktimeGroup: boolean;

  $: {
    showEstWorktimeGroup = td.estWorktime && td.estWorktime.asMinutes() !== 0;
    let showSpentWorktimeGroup =
      td.spentWorktime && td.spentWorktime.asMinutes() !== 0;
    showWorktimeGroup = showSpentWorktimeGroup || showEstWorktimeGroup;
  }

  const showDuePicker = () => {
    new DatePickerModal(
      td.plugin.app,
      window.moment(td.due),
      'Due date',
      (newDueDate: Moment) => {
        if (td.file) {
          td.plugin.fileInterface.updateFMProp(
            td.file,
            newDueDate,
            'due',
          );
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
      td.repeatConfig,
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

</script>
<div class="props">
    {#if showWorktimeGroup}
      <span class="group">
        <span id="spent-worktime-container" class="group">
          {@html timer}
          <span class="prop-text" id="spent-worktime"
            >{durationFormat_hm(td.spentWorktime)}</span
          >
        </span>
        {#if showEstWorktimeGroup}
          <span id="worktime-seperator"> / </span>
          <span id="est-worktime-container" class="group">
            {@html timer}
            <span class="prop-text" id="est-worktime"
              >{durationFormat_hm(td.estWorktime)}</span
            >
          </span>
        {/if}
      </span>
    {/if}
    {#if td.due && td.due !== '' }
      <span class="group" on:click={showDuePicker}>
        {@html calendar}
        <span class="prop-text" id="due">{td.due?.format('YYYY-MM-DD')}</span
        >
      </span>
    {/if}
    {#if td.scheduled && td.scheduled !== ''}
      <span class="group" on:click={showSchedulePicker}>
        {@html hourglass}
        <span class="prop-text" id="scheduled"
          >{td.scheduled?.format('YYYY-MM-DD')}</span
        >
      </span>
    {/if}
    {#if td.repeatConfig  &&  td.repeatConfig !== ''}
      <span class="group" on:click={showRepeatPicker}>
        {@html repeat}
        <span class="prop-text" id="repeat"
          >{td.repeatConfig?.toLowerCase()}</span
        >
      </span>
    {/if}
  </div>
<style>
    .props {
    font-size: 1rem;
    display: flex;
    flex-direction: row;
  }

  .group > .group:first-child {
    margin-left: 0px;
  }

  .group {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 8px;
  }

  .group:hover {
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