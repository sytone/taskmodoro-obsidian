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
  import moment from 'moment';
  import type { Frontmatter } from '../../Parser';

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

  const dailyScheduledWorktimeOnReset = () => {
    td.dailyScheduledWorktime = null;

    const replacer = (value: any, frontmatter: Frontmatter) => {
      const now = moment().format('YYYY-MM-DD');
      let dailyScheduledWorktime: { [key: string]: Object } = frontmatter.get(
        'daily_scheduled_worktime',
      );
      delete dailyScheduledWorktime[now];
      return dailyScheduledWorktime;
    };

    if (mode === TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(
        td.file,
        null,
        'daily_scheduled_worktime',
        false,
        replacer,
      );
    }
  };

  const estWorktimeOnReset = () => {
    td.estWorktime = null;
    if (mode === TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(td.file, null, 'estimated_worktime');
    }
  };

  const pomodoroLengthOnReset = () => {
    td.pomodoroLenght = moment.duration(30, 'minutes');
    if (mode === TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(
        td.file,
        { minutes: 30 },
        'pomodoro_length',
      );
    }
  };

  const repeatOnReset = () => {
    td.recurringConfig = '';
    if (mode === TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(td.file, '', 'repeat');
    }
  };

  const scheduledOnReset = () => {
    td.scheduled = '';
    if (mode === TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(td.file, '', 'scheduled');
    }
  };

  const dueOnReset = () => {
    td.due = '';
    if (mode === TaskDetailsMode.Update) {
      td.plugin.fileInterface.updateFMProp(td.file, '', 'due');
    }
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
      onReset={dueOnReset}
      value={!td.due ? 'Someday' : td.due}
    />

    <TaskDetailsSidebarProp
      title="Scheduled date"
      onSelect={() => {
        showScheduledDatePicker(td, mode, updater);
      }}
      onReset={scheduledOnReset}
      value={!td.scheduled ? 'Someday' : td.scheduled}
    />

    <TaskDetailsSidebarProp
      title="Repeat"
      onSelect={() => {
        showRepeatPicker(td, mode, updater);
      }}
      onReset={repeatOnReset}
      value={!td.recurringConfig ? 'None' : td.recurringConfig}
    />

    <TaskDetailsSidebarProp
      title="Pomodoro length"
      onSelect={() => {
        showPomoLengthPicker(td, mode, updater);
      }}
      onReset={pomodoroLengthOnReset}
      value={`${td.pomodoroLenght.asMinutes()}min`}
    />

    <TaskDetailsSidebarProp
      title="Estimated worktime"
      onSelect={() => {
        showEstWorktimePicker(td, mode, updater);
      }}
      onReset={estWorktimeOnReset}
      value={td.getWorktimeStr(td.estWorktime)}
    />

    <TaskDetailsSidebarProp
      title="Daily scheduled worktime"
      onSelect={() => {
        showDailyScheduleWorktimePicker(td, mode, updater);
      }}
      onReset={dailyScheduledWorktimeOnReset}
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
