<script lang="ts">
  import type { Duration } from 'moment';
  import type PomodoroSessionStore from '../../stores/PomodoroSessionStore';
  export let sessionLength: Duration;
  export let pomodoroSessionStore: PomodoroSessionStore;
  const sessionLeft = pomodoroSessionStore.sessionLeft;
  $: progessLowerBound =
    100 - ($sessionLeft.asSeconds() * 100) / sessionLength.asSeconds();
  $: range = progessLowerBound === 0 ? 0 : 5;
  $: progressUpperBound = progessLowerBound + range;
  $: cssVars = `--progressLowerBound: ${progessLowerBound}%; --progressUpperBound: ${progressUpperBound}% ;`;
</script>

<div style={cssVars} class="pomodoro-session-duration-progress">
  <slot />
</div>

<style>
  .pomodoro-session-duration-progress {
    padding: 1px 1px;
    border-radius: 10px;
    background: linear-gradient(
      to right,
      var(--text-accent) var(--progressLowerBound),
      transparent var(--progressUpperBound),
      transparent 100%
      );

  }
</style>
