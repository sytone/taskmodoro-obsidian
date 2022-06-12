<script lang="ts">
  import type { Moment } from 'moment';

  import type { App } from 'obsidian';

  import { DuePickerModal, RepeatPickerModal } from '../modals';
  import { externalLink } from '../graphics';

  const formatDate = (date: Moment): string => {
    return date.format('YYYY-MM-DD');
  };

  export let due: string;
  export let taskName: string;
  export let scheduled: string;
  export let repeatConfig: string;
  export let app: App;
  export let onCreate: ()=>void = null;

  let isCreateBtnEnabled = true;
  $: isCreateBtnEnabled = taskName != '';

  
  const showDueDatePicker = () => {
    let pickerStartDate =
      due == '' ? window.moment() : window.moment(due);
    new DuePickerModal(app, pickerStartDate, (newDueDate: Moment) => {
      due = formatDate(newDueDate);
    }).open();
  };
  const showScheduledDatePicker = () => {
    let pickerStartDate =
      scheduled == '' ? window.moment() : window.moment(scheduled);
    new DuePickerModal(app, pickerStartDate, (newStartDate: Moment) => {
      scheduled = formatDate(newStartDate);
    }).open();
  };

  const showRepeatPicker = () => {
    let startRepeatPickerConfig = repeatConfig;
    new RepeatPickerModal(
      app,
      startRepeatPickerConfig,
      (newRepeatConfig: string) => {
        repeatConfig = newRepeatConfig;
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
      <div class="sidebar-input" on:click={showDueDatePicker}>{due==''?'Someday':due}</div>
    </div>
    <div class="group">
      <div class="label">Scheduled date</div>
      <div class="sidebar-input" on:click={showScheduledDatePicker}>
        {scheduled==''?'Someday':scheduled}
      </div>
    </div>
    <div class="group">
      <div class="label">Repeat</div>
      <div class="sidebar-input" on:click={showRepeatPicker}>
        {repeatConfig==''?'None':repeatConfig}
      </div>
    </div>
  </div>
  <div class="create-btn-wrapper">
    <button
      disabled={!isCreateBtnEnabled}
      class="mod-cta create-btn 
      {isCreateBtnEnabled ? '' : 'disabled-btn'}"
      on:click={onCreate}>Create</button
    >
  </div>
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
