<script lang="ts">
  import type { Duration } from 'moment';
  import { PomodoroSessionType, TimerState } from '../../enums/timer-state';
  import type PomodoroSession from '../../stores/PomodoroSession';
  export let pomodoroSession: PomodoroSession;

  const sessionLeft = pomodoroSession.sessionLeft;
  const sessionLength = pomodoroSession.sessionLength
  let cssVars = '';
  let state = pomodoroSession.state;
  let type = pomodoroSession.type;
  $: progessLowerBound = getLowerBound($sessionLeft);
  $: range = progessLowerBound === 0 ? 0 : 5;
  $: progressUpperBound = progessLowerBound + range;
  $: {
    cssVars = `--progressLowerBound: ${progessLowerBound}%;`;
    cssVars += `--progressUpperBound: ${progressUpperBound}%;`;
    cssVars += `--indicator-color: var(${getIndicatorColor()});`;
  }


  const getLowerBound = (sessionLeft: Duration) => {
    if ($state === TimerState.DONE) {
      return 100;
    } else {
      let lowerBound =
        100 - (sessionLeft.asSeconds() * 100) / $sessionLength.asSeconds();
      return Math.round(lowerBound);
    }
  };
  const getIndicatorColor = () => {
    const typeStr = PomodoroSessionType[$type].toLowerCase();
    return `--pomodoro-${typeStr}-indicator`;
  };
</script>

<div style={cssVars} class="pomodoro-session-duration-progress">
  <slot />
</div>

<style>
  /* TODO: add transition */
  
  :global(.is-popout-window .pomodoro-session-duration-progress){
    padding-bottom: 1px;
    padding-right: 0.5px;
  }

  .pomodoro-session-duration-progress {
    padding: 1px 1px;
    padding-bottom: 0.5px;
    border-radius: 10px;
    background: linear-gradient(
      to right,
      var(--indicator-color) var(--progressLowerBound),
      transparent var(--progressUpperBound),
      transparent 100%
    );
  }
</style>
