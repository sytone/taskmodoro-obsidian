<script lang="ts">
  import type { Task } from '../../file-interface';
  import type TQPlugin from '../../main';
  import type { Duration } from 'moment';
  import { TaskListTileParent } from '../../enums/component-context';
  import TaskListTile from './../TaskListTile.svelte';
  import PomodoroTimer from './PomodoroTimer.svelte';
import moment from 'moment';

  export let task: Task;
  export let plugin: TQPlugin;
  export let duration: Duration | undefined;

</script>

<div class="tq">
  <div class="pomodoro-task-wrapper">
    <TaskListTile
      parent={TaskListTileParent.PomodoroTaskView}
      {plugin}
      {task}
      view={null}
    />
  </div>
  <PomodoroTimer initialDuration={duration} />
</div>

<style>
  .pomodoro-task-wrapper {
    padding: 0 8px;
  }
</style>
