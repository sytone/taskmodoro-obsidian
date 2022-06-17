<script lang="ts">
  import type { Moment } from 'moment';
  import type TaskDetails from '../../task-details';
  import { TaskDetailsMode } from '../../enums/component-context';
  import { DatePickerModal, RepeatPickerModal } from '../../modals';
  import { formatDate } from '../../util';
  import { externalLink } from '../../graphics';

  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  let isCreateBtnEnabled = true;
  $: isCreateBtnEnabled = td.taskName != '';

  const showDueDatePicker = () => {
    let pickerStartDate =
      td.due == '' ? window.moment() : window.moment(td.due);
    new DatePickerModal(
      td.plugin.app,
      pickerStartDate,
      'Due date',
      (newDueDate: Moment) => {
        td.due = formatDate(newDueDate);
        td = td;
      },
    ).open();
  };

  const showScheduledDatePicker = () => {
    let pickerStartDate =
      td.scheduled == '' || !td.scheduled
        ? window.moment()
        : window.moment(td.scheduled);
    new DatePickerModal(
      td.plugin.app,
      pickerStartDate,
      'Schedule date',
      (newStartDate: Moment) => {
        td.scheduled = formatDate(newStartDate);
        td = td;
      },
    ).open();
  };

  const showRepeatPicker = () => {
    let startRepeatPickerConfig = td.repeatConfig;
    new RepeatPickerModal(
      td.plugin.app,
      startRepeatPickerConfig,
      (newRepeatConfig: string) => {
        td.repeatConfig = newRepeatConfig;
        td = td;
      },
    ).open();
  };
</script>

<div class="task-details-sidebar">
  <span class="external-link-wrapper">
    <span class="external-link-icon">{@html externalLink}</span>
  </span>
  <div class="sidebar-container">
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
