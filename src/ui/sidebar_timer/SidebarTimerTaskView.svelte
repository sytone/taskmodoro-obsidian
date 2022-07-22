<script lang="ts">
  import type { Task } from '../../file-interface';
  import type TQPlugin from '../../main';
  import type { Duration } from 'moment';
  import { TaskListTileParent } from '../../enums/component-context';
  import TaskListTile from '../task_tile/TaskTile.svelte';
  import TimerView from './TimerView.svelte';
  import moment from 'moment';
  import type { TaskDetails } from 'src/task-details';
  import PomodoroSessionProgress from './PomodoroSessionProgress.svelte';
  import PomodoroSessionStore from '../../stores/PomodoroSessionStore';
  export let td: TaskDetails;
  export let plugin: TQPlugin;

  const pomodoroSessionStore = new PomodoroSessionStore();
</script>

<div class="tq">
  <div class="timer-task-container">
    <PomodoroSessionProgress
      sessionLength={td.pomoDuration}
      {pomodoroSessionStore}
    >
      <TaskListTile
        view={null}
        bind:td
        parentComponent={TaskListTileParent.TimerTaskView}
      />
    </PomodoroSessionProgress>
  </div>
  <TimerView file={td.file} {plugin} {pomodoroSessionStore} sessionLength={td.pomoDuration} />
</div>

<style>
  .timer-task-container {
    padding: 0 8px;
  }
</style>
