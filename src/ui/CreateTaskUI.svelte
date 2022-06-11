<script lang="ts">
  import RepeatPicker from './RepeatPicker.svelte';
  import DuePicker from './DuePicker.svelte';
  import { externalLink } from '../graphics';
  import { Component, MarkdownRenderer } from 'obsidian';
  import type { Moment } from 'moment';
  import type { App, TextAreaComponent } from 'obsidian';
  import TextSuggest from './TextSuggest.svelte';
  import { afterUpdate, onMount } from 'svelte';
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import { DuePickerModal, RepeatPickerModal } from '../modals';

  export let close: () => void;
  export let store: (
    taskName: string,
    description: string,
    due: string,
    scheduled: string,
    repeat: string,
    tags: string[],
  ) => void;
  export let app: App;

  const tagCache = Object.keys((app.metadataCache as any).getTags());
  let taskName = '';
  let description = '';
  let repeats = false;
  let repeatConfig = 'None';
  let due = 'Someday';
  let scheduled = 'Someday';
  let tags = '';

  let isCreateBtnEnabled = true;
  $: isCreateBtnEnabled = taskName != '';

  const create = () => {
    const cleanedTags = tags
      .split(/[, ]/)
      .filter((x) => x !== '')
      .map((tag) => tag.trim().replace('#', ''));

    store(
      taskName,
      description,
      due,
      scheduled,
      repeats ? repeatConfig : '',
      cleanedTags,
    );

    close();
  };

  const formatDate = (date: Moment): string => {
    return date.format('YYYY-MM-DD');
  };

  const showDueDatePicker = () => {
    let pickerStartDate = due == 'Someday' ? window.moment() : window.moment(due);
    new DuePickerModal(app, pickerStartDate, (newDueDate: Moment) => {
      due = formatDate(newDueDate);
    }).open();
  };
  const showScheduledDatePicker = () => {
    let pickerStartDate = scheduled == 'Someday' ? window.moment() : window.moment(scheduled);
    new DuePickerModal(app, pickerStartDate, (newStartDate: Moment) => {
      scheduled = formatDate(newStartDate);
    }).open();
  };

  const showRepeatPicker = () => {
    let startRepeatPickerConfig = repeatConfig=='None' ? '' : repeatConfig;
    new RepeatPickerModal(app, startRepeatPickerConfig, (newRepeatConfig: string) => {
      repeatConfig = newRepeatConfig;
    }).open();
  };
  // TODO: Allow setting arbitrary fields in this form, configured in settings
</script>

<TaskDetailsMainPanel isNewTask={true} completed={false} bind:description bind:taskName />
<div class="task-details-sidebar">
  <span class="external-link-wrapper">
    <span class="external-link-icon">{@html externalLink}</span>
  </span>
  <div class="sidebar-container">
    <div class="group">
      <div class="label">Due date</div>
      <div class="sidebar-input" on:click={showDueDatePicker}>{due}</div>
    </div>
    <div class="group">
      <div class="label">Scheduled date</div>
      <div class="sidebar-input" on:click={showScheduledDatePicker}>{scheduled}</div>
    </div>
    <div class="group">
      <div class="label">Repeat</div>
      <div class="sidebar-input" on:click={showRepeatPicker}>{repeatConfig}</div>
    </div>
  </div>
  <div class='create-btn-wrapper'>
    <button disabled={!isCreateBtnEnabled}
    class="mod-cta create-btn 
    {isCreateBtnEnabled ? '' : 'disabled-btn'}"
    on:click={create}>Create</button>
  </div>
</div>

<style>
  .create-btn{
    width: 100%;
  }

  .create-btn-wrapper{
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
