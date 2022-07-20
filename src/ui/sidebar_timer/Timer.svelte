<script lang="ts">
  import moment from 'moment';
  import type { Moment } from 'moment';
  import MomentDurationSetup from 'moment-duration-format';
  import { TimerState } from '../../enums/timer-state';
  // import type { Duration } from 'moment';
  import type { TFile } from 'obsidian';
  import type TQPlugin from '../../main';
  MomentDurationSetup(moment);
  import type { Duration } from 'moment';
  import PomodoroCompletionSound from '../../../resources/sfx/pomodoro-completion.mp3'
  import {
    timerMarker,
    circledPause,
    circledPlay,
    circledStop,
  } from '../../graphics';

  export let initialDuration: Duration;
  export let plugin: TQPlugin;
  export let file: TFile;

  let markerCnt = 16;
  let markers = Array(markerCnt);
  const rotateVar = (i: number) => `--rotate: ${(i * 360) / markerCnt}deg;`;

  let duration = initialDuration.clone();
  let activityDur: Duration;
  let state = TimerState.INITIALIZED;
  let startedAt: Moment;
  let timer: NodeJS.Timer;

  const playPomodoroCompetionSound = ()=>{
    const audio = new Audio(PomodoroCompletionSound)
    audio.play()
  }

  const start = (): void => {
    state = TimerState.ONGOING;
    startedAt = moment(new Date());
    activityDur = moment.duration();
    
    timer = setInterval(() => {
      if (duration.asSeconds() == 0) {
        playPomodoroCompetionSound()
        stop();
      }else {
        duration = duration.subtract(1, 'second');
        activityDur = activityDur.add(1, 'second');
        markers = markers;
      }
    }, 1000);
  };

  const isMarkerFilled = (markerIndex: number): boolean => {
    let markerDuration = initialDuration.asSeconds() / markerCnt;
    let durFromInitial = initialDuration
      .clone()
      .subtract(duration.asSeconds(), 'seconds')
      .asSeconds();
    let currMarkerUpperBound = (markerIndex + 1) * markerDuration;
    if (currMarkerUpperBound <= durFromInitial) {
      return true;
    }
    return false;
  };

  const pause = (): void => {
    state = TimerState.PAUSED;
    setTimerActivity()
    clearInterval(timer);
  };

  const stop = (): void => {
    if (TimerState.ONGOING) {
        setTimerActivity()
    }
    
    state = TimerState.INITIALIZED;

    clearInterval(timer);
    duration = initialDuration.clone();
    // console.log(duration.asSeconds())
  };

  const setTimerActivity = () => {
    let endedAt = startedAt.clone().add(activityDur);
    plugin.fileInterface.setTimerActivity(
      file,
      startedAt,
      endedAt,
    );
  };

$:  durationStr = duration.asSeconds() === 0 ? '0:00' : duration.format()
$: console.log(duration.asSeconds())
</script>


<div class="timer">
  <div class="timer-container">
    {#each markers as _, i (i)}
      <span style="{rotateVar(i)} " class="timer-marker">
        {#if isMarkerFilled(i)}
          <span class="filled-timer-marker">
            {@html timerMarker}
          </span>
        {:else}
          <span class="dashed-timer-marker">
            {@html timerMarker}
          </span>
        {/if}
      </span>
    {/each}
    <div class="timer-runtime">{durationStr}</div>
  </div>
</div>
<div class="timer-actions-container">
  {#if state == TimerState.INITIALIZED}
    <div class="timer-action" on:click={start}>{@html circledPlay}</div>
  {/if}
  {#if state == TimerState.ONGOING}
    <div class="timer-action" on:click={pause}>{@html circledPause}</div>
  {/if}
  {#if state == TimerState.PAUSED}
    <div class="timer-action" on:click={start}>{@html circledPlay}</div>
    <div class="timer-action" on:click={stop}>{@html circledStop}</div>
  {/if}
</div>

<style>
  .timer-action {
    margin: 0 8px;
  }

  .timer-actions-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: -3rem;
  }
  
  .timer-runtime {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #efe8e8;
    font-size: 3rem;
  }

  :global(.timer-action .circle-play) {
    width: 48px;
  }

  :global(.dashed-timer-marker > svg) {
    width: 16px;
    stroke-width: 8;
    stroke: #efe8e8;
  }

  :global(.dashed-timer-marker > path) {
    stroke-dasharray: 16;
  }

  :global(.filled-timer-marker > svg) {
    width: 16px;
    stroke-width: none;
    stroke: none;
    fill: #efe8e8;
  }

  :global(.filled-timer-marker > path) {
    stroke-dasharray: none;
  }

  .timer-marker {
    display: flex;
    flex-direction: row;
    justify-content: center;
    grid-area: 1/1;
    transform: rotate(var(--rotate));
  }

  .timer .timer-container {
    position: relative;
    margin: 1rem 1rem 2rem 1rem;
    width: 280px;
    min-width: 280px;
    aspect-ratio: 1/1.5;
    display: grid;
    grid-template-columns: 30px;
    grid-template-rows: 100%;
    place-content: center;
  }

  .timer {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
