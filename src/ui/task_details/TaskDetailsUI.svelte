<script lang="ts">
  import TaskDetailsMainPanel from './TaskDetailsMainPanel.svelte';
  import TaskDetailsSidebar from './TaskDetailsSidebar.svelte';
import type TQPlugin from '../../main';
import type { TaskDetailsMode } from '../../enums/component-context';
import type { Task } from '../../file-interface';
import type {TaskDetails} from '../../task-details';

  export let close: () => void;
  export let mode: TaskDetailsMode;
  export let td: TaskDetails;
  td.close = close;

</script>

<TaskDetailsMainPanel {mode} bind:td />
<TaskDetailsSidebar {mode} bind:td />

<style>
</style>
