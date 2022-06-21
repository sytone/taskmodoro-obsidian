<script lang="ts">
  import moment, { Duration, duration, Moment } from 'moment';

  import type TaskDetails from '../../task-details';
  import { TaskDetailsMode } from '../../enums/component-context';
  import {
    DatePickerModal,
    DurationPickerModal,
    RepeatPickerModal,
  } from '../../modals';
  import { formatDate, formatFMDate } from '../../util';
  import { externalLink } from '../../graphics';
  import DurationPicker from './../pickers/duration_picker/DurationPicker.svelte';

  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let isCreateBtnEnabled = true;
  $: isCreateBtnEnabled = td.taskName != '';

  let isDurationPickerVisible = false;

  const showDueDatePicker = () => {
    let pickerStartDate = td.due == '' ? moment() : moment(td.due);

    const onSet = (newDueDate: Moment) => {
      td.due = formatDate(newDueDate);
      td = td;
      if (TaskDetailsMode.Update) {
        td.plugin.fileInterface.updateFMProp(
          td.file,
          td.plugin.app.vault,
          newDueDate,
          'due',
        );
      }
    };

    new DatePickerModal(
      td.plugin.app,
      pickerStartDate,
      'Due date',
      onSet,
    ).open();
  };

  const showScheduledDatePicker = () => {
    let pickerStartDate =
      td.scheduled == '' ? moment() : moment(td.scheduled);

    const onSet = (newScheduledDate: Moment) => {
      td.scheduled = formatDate(newScheduledDate);
      td = td;
      if (TaskDetailsMode.Update) {
        td.plugin.fileInterface.updateFMProp(
          td.file,
          td.plugin.app.vault,
          newScheduledDate,
          'scheduled',
        );
      }
    };

    new DatePickerModal(
      td.plugin.app,
      pickerStartDate,
      'Schedule date',
      onSet,
    ).open();
  };

  const showRepeatPicker = () => {
    let startRepeatPickerConfig = td.repeatConfig;

    const onSet = (newRepeatConfig: string) => {
      td.repeatConfig = newRepeatConfig;
      td = td;
      if (TaskDetailsMode.Update) {
        td.plugin.fileInterface.updateFMProp(
          td.file,
          td.plugin.app.vault,
          newRepeatConfig,
          'repeat',
        );
      }
    };

    new RepeatPickerModal(td.plugin.app, startRepeatPickerConfig, onSet).open();
  };

  const showPomoLengthPicker = () => {

    const onSet = (newPomoLength: Duration) => {
      td.pomodoroLength = newPomoLength;

      td = td;
      if (TaskDetailsMode.Update) {
        td.plugin.fileInterface.updateFMProp(
          td.file,
          td.plugin.app.vault,
          newPomoLength.format(),
          'pomodoro_length',
        );
      }
    };

    new DurationPickerModal(
      td.plugin.app,
      'Pomodoro length',
      td.pomodoroLength,
      onSet,
    ).open();

  };
</script>

<div class="task-details-sidebar">
  <span class="external-link-wrapper">
    <span class="external-link-icon">{@html externalLink}</span>
  </span>
  <div class="sidebar-container">
    <div class="group">
      <div class="label">Pomodoro length</div>
      <div class="sidebar-input" on:click={showPomoLengthPicker}>
        {td.pomodoroLength.format()}
      </div>
    </div>

    <div class="group">
      <div class="label">Due date</div>
      <div class="sidebar-input" on:click={showDueDatePicker}>
        {td.due == '' || !td.due ? 'Someday' : td.due}
      </div>
    </div>
    <div class="group">
      <div class="label">Scheduled date</div>
      <div class="sidebar-input" on:click={showScheduledDatePicker}>
        {td.scheduled == '' || !td.scheduled ? 'Someday' : td.scheduled}
      </div>
    </div>
    <div class="group">
      <div class="label">Repeat</div>
      <div class="sidebar-input" on:click={showRepeatPicker}>
        {td.repeatConfig == '' || !td.repeatConfig ? 'None' : td.repeatConfig}
      </div>
    </div>
  </div>
  {#if mode === TaskDetailsMode.Create}
    <div class="create-btn-wrapper">
      <button
        disabled={!isCreateBtnEnabled}
        class="mod-cta create-btn 
      {isCreateBtnEnabled ? '' : 'disabled-btn'}"
        on:click={td.onCreate}>Create</button
      >
    </div>
  {/if}
</div>

<style>
  .create-btn {
    width: 100%;
  }

  .create-btn-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  .external-link-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: end;
  }

  .external-link-icon {
    /* position: absolute; */
    /* align-self: flex-end; */
    padding-right: 44px;
  }

  .task-details-sidebar {
    background-color: #151719 !important;

    width: 30%;
    padding: 24px 24px;
    /* position: relative; */
  }
  .sidebar-container {
    padding: 24px 0px;
  }
  .group {
    padding-bottom: 24px;
  }
  .sidebar-input {
    background-color: transparent;
    border: none;
    width: 100%;
    padding: 0 0;
  }

  .sidebar-input:hover,
  .sidebar-input:focus {
    cursor: pointer;
    background-color: #1b1e20;
  }

  .label {
    font-size: 1rem;
    padding-bottom: 8px;
    color: var(--mid-blue-gray);
  }
</style>
