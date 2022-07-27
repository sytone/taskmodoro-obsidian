<script lang="ts">
  import type { Task } from '../../FileInterface';
  import type TQPlugin from '../../main';
  import type { Duration } from 'moment';
  import { TaskListTileParent } from '../../Enums/component-context';
  import TaskListTile from '../TaskTile/TaskTile.svelte';
  import TimerView from './TimerView.svelte';
  import moment from 'moment';
  import type { TaskDetails } from 'src/TaskDetails';
  import PomodoroSessionProgress from './PomodoroSessionProgress.svelte';
  import PomodoroSession from '../../Stores/PomodoroSession';
  export let td: TaskDetails;
  export let plugin: TQPlugin;

  const pomodoroSession = new PomodoroSession(td.pomodoroLenght);
</script>

<div class="tq">
  <div class="timer-task-container">
    <PomodoroSessionProgress
     {pomodoroSession}
    >
      <TaskListTile
        view={null}
        bind:td
        parentComponent={TaskListTileParent.TimerTaskView}
      />
    </PomodoroSessionProgress>
  </div>
  <TimerView file={td.file} {plugin} {pomodoroSession} workSessionLength={td.pomodoroLenght} />
</div>

<style>
  .timer-task-container {
    padding: 0 8px;
  }
</style>
