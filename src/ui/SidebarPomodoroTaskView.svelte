<script lang="ts">
  import type TQPlugin from './../main';
  import type { Task } from './../file-interface';
  import PomodoroTimer from './PomodoroTimer.svelte';
  import TaskListTile from './TaskListTile.svelte';
  import type { Duration } from 'moment';
  import { TaskListTileParent } from '../enums/component-parent';
  export let task: Task;
  export let plugin: TQPlugin;
  export let duration: Duration;
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
  <PomodoroTimer />
</div>

<style>
  .pomodoro-task-wrapper {
    padding: 0 8px;
  }
</style>
