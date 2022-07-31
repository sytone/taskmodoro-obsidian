<script lang="ts">
  import type { TaskDetails } from '../../TaskDetails';
  import { TaskDetailsMode } from '../../Enums/component-context';

  import TextSuggest from '../TextSuggest.svelte';
  import TimerOpenBtn from '../TimerOpenBtn.svelte';
  import ViewSourceBtn from '../ViewSourceBtn.svelte';
  import { onMount } from 'svelte';
  import {
    showEstWorktimePicker,
    showDailyScheduleWorktimePicker,
  } from '../../Helpers/ShowPickers';
  import {
    showRepeatPicker,
    showPomoLengthPicker,
  } from '../../Helpers/ShowPickers';
  import {
    showDueDatePicker,
    showScheduledDatePicker,
  } from '../../Helpers/ShowPickers';
  import TaskDetailsSidebarProp from './TaskDetailsSidebarProp.svelte';

  export let td: TaskDetails;
  export let mode: TaskDetailsMode;

  const tagCache = Object.keys((td.plugin.app.metadataCache as any).getTags());
  let isCreateBtnEnabled = true;
  $: {
    isCreateBtnEnabled = td.taskName != '';
  }

  onMount(() => {
    if (mode === TaskDetailsMode.Create) {
      if (td.parents.length === 0) {
        td.tags = td.plugin.settings.RootTasksTags + td.tags;
      }
    }
  });

  const updateTagsFm = () => {
    if (mode == TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(td.file, td.cleanedTags, 'tags');
    }
  };
  const showPomodoroTaskView = async () => {
    await td.plugin.activatePomodoroTaskView(td);
    td.close();
  };

  const updater = () => {
    td = td;
  };
</script>

<div class="TaskDetails-sidebar">
  <span class="sidebar__external-actions-container">
    {#if mode !== TaskDetailsMode.Create}
      <TimerOpenBtn on:click={showPomodoroTaskView} />
    {/if}
    <ViewSourceBtn
      file={td.file}
      classes="external-link-wrapper"
      plugin={td.plugin}
      close={td.close}
    />
  </span>
  <div class="sidebar-container">
    <TaskDetailsSidebarProp
      title="Due date"
      onSelect={() => {
        showDueDatePicker(td, mode, updater);
      }}
      value={!td.due ? 'Someday' : td.due}
    />

    <TaskDetailsSidebarProp
      title="Scheduled date"
      onSelect={() => {
        showScheduledDatePicker(td, mode, updater);
      }}
      value={!td.scheduled ? 'Someday' : td.scheduled}
    />

    <TaskDetailsSidebarProp
      title="Repeat"
      onSelect={() => {
        showRepeatPicker(td, mode, updater);
      }}
      value={!td.recurringConfig ? 'None' : td.recurringConfig}
    />

    <TaskDetailsSidebarProp
      title="Pomodoro length"
      onSelect={() => {
        showPomoLengthPicker(td, mode, updater);
      }}
      value={`${td.pomodoroLenght.asMinutes()}min`}
    />

    <TaskDetailsSidebarProp
      title="Estimated worktime"
      onSelect={() => {
        showEstWorktimePicker(td, mode, updater);
      }}
      value={td.getWorktimeStr(td.estWorktime)}
    />

    <TaskDetailsSidebarProp
      title="Daily scheduled worktime"
      onSelect={() => {
        showDailyScheduleWorktimePicker(td, mode, updater);
      }}
      value={td.getWorktimeStr(td.dailyScheduledWorktime)}
    />

    <div class="group">
      <div class="label">Tags</div>
      <TextSuggest
        classes={'tag-input'}
        app={td.plugin.app}
        suggestions={tagCache}
        placeholder="Add a tag"
        bind:value={td.tags}
        onFocusout={updateTagsFm}
      />
    </div>
  </div>
  {#if mode === TaskDetailsMode.Create}
    <div class="create-btn-wrapper">
      <button
        disabled={!isCreateBtnEnabled}
        class="mod-cta create-btn
                                {isCreateBtnEnabled ? '' : 'disabled-btn'}"
        on:click={td.create}>Create</button
      >
    </div>
  {/if}
</div>

<style>
  :global(.TaskDetails-sidebar .tag-input) {
    padding-bottom: 8px;
    border-bottom: 1px solid #2a2d30;
  }

  .create-btn {
    width: 100%;
  }

  .create-btn-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  .sidebar__external-actions-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .TaskDetails-sidebar {
    background-color: #151719;
    width: 30%;
    padding: 24px 24px;
  }

  .sidebar-container {
    padding: 24px 0px;
  }

  .group {
    padding-bottom: 24px;
  }

  .label {
    font-size: 1rem;
    padding-bottom: 8px;
    color: var(--mid-blue-gray);
  }
</style>
