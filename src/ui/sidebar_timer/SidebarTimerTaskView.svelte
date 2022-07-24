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
  import PomodoroSession from '../../stores/PomodoroSession';
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
