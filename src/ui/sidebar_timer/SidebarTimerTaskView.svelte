<script lang="ts">
  import type { Task } from '../../file-interface';
  import type TQPlugin from '../../main';
  import type { Duration } from 'moment';
  import { TaskListTileParent } from '../../enums/component-context';
  import TaskListTile from '../task_tile/TaskTile.svelte';
  import Timer from './Timer.svelte';
  import moment from 'moment';
  import type { TaskDetails } from 'src/task-details';
  export let td: TaskDetails;
  export let plugin: TQPlugin;
</script>

<div class="tq">
  <div class="timer-task-container">
    <TaskListTile
      view={null}
      bind:td
      parentComponent={TaskListTileParent.TimerTaskView}
    />
  </div>
  <Timer file={td.file} {plugin} initialDuration={td.pomoDuration} />
</div>

<style>
  .timer-task-container {
    padding: 0 8px;
  }

</style>
