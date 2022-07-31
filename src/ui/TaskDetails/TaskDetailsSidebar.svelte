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
</script>

<div class="TaskDetails-sidebar">
  <span class="sidebar-refs-container">
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
    <div class="group">
      <div class="label">Due date</div>
      <div class="sidebar-input" on:click={() => showDueDatePicker(td, mode)}>
        {td.due == '' || !td.due ? 'Someday' : td.due}
      </div>
    </div>
    <div class="group">
      <div class="label">Scheduled date</div>
      <div
        class="sidebar-input"
        on:click={() => showScheduledDatePicker(td, mode)}
      >
        {td.scheduled == '' || !td.scheduled ? 'Someday' : td.scheduled}
      </div>
    </div>
    <div class="group">
      <div class="label">Repeat</div>
      <div class="sidebar-input" on:click={() => showRepeatPicker(td, mode)}>
        {td.recurringConfig == '' || !td.recurringConfig
          ? 'None'
          : td.recurringConfig}
      </div>
    </div>
    <div class="group">
      <div class="label">Pomodoro length</div>
      <div
        class="sidebar-input"
        on:click={() => showPomoLengthPicker(td, mode)}
      >
        {`${td.pomodoroLenght.asMinutes()}min`}
      </div>
    </div>
    <div class="group">
      <div class="label">Estimated worktime</div>
      <div
        class="sidebar-input"
        on:click={() => showEstWorktimePicker(td, mode)}
      >
        {td.getWorktimeStr(td.estWorktime)}
      </div>
    </div>
    <div class="group">
      <div class="label">Daily scheduled worktime</div>
      <div
        class="sidebar-input"
        on:click={() => showDailyScheduleWorktimePicker(td, mode)}
      >
        {td.getWorktimeStr(td.dailyScheduledWorktime)}
      </div>
    </div>
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
  <!-- </div> -->
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

  .sidebar-refs-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .TaskDetails-sidebar {
    background-color: #151719;

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
