<script lang="ts">
  import moment from 'moment';
  import type { Moment } from 'moment';
  import MomentDurationSetup from 'moment-duration-format';
  import { TimerState } from '../../enums/timer-state';
  // import type { Duration } from 'moment';
  import type { TFile } from 'obsidian';
  import type TQPlugin from '../../main';
  MomentDurationSetup(moment);
  import { init } from 'svelte/internal';
  import type { Duration } from 'moment';

  import {
    timerLeaf,
    circledPause,
    circledPlay,
    circledStop,
  } from '../../graphics';

  export let initialDuration: Duration;
  export let plugin: TQPlugin;
  export let file: TFile;

  let leavesCnt = 16;
  let leaves = Array(leavesCnt);
  const rotateVar = (i: number) => `--rotate: ${(i * 360) / leavesCnt}deg;`;

  let duration = initialDuration.clone();
  let activityDur: Duration;
  let state = TimerState.INITIALIZED;
  let startedAt: Moment;
  let timer: NodeJS.Timer;

  const start = (): void => {
    state = TimerState.ONGOING;
    startedAt = moment(new Date());
    activityDur = moment.duration();
    
    timer = setInterval(() => {
      if (duration.asSeconds() == 0) {
        stop();
      }
      duration = duration.subtract(1, 'second');
      activityDur = activityDur.add(1, 'second');
      leaves = leaves;
    }, 1000);
  };

  const isLeafFilled = (leafIndex: number): boolean => {
    let leafDuration = initialDuration.asSeconds() / leavesCnt;
    let durFromInitial = initialDuration
      .clone()
      .subtract(duration.asSeconds(), 'seconds')
      .asSeconds();
    let currLeafUpperBound = (leafIndex + 1) * leafDuration;
    if (currLeafUpperBound <= durFromInitial) {
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

    duration = initialDuration.clone();
    clearInterval(timer);
  };

  const setTimerActivity = () => {
    let endedAt = startedAt.clone().add(activityDur);
    plugin.fileInterface.setTimerActivity(
      file,
      plugin.app.vault,
      startedAt,
      endedAt,
    );
  };

</script>

<div class="timer">
  <div class="timer-container">
    {#each leaves as _, i (i)}
      <span style="{rotateVar(i)} " class="timer-leaf">
        {#if isLeafFilled(i)}
          <span class="filled-timer-leaf">
            {@html timerLeaf}
          </span>
        {:else}
          <span class="dashed-timer-leaf">
            {@html timerLeaf}
          </span>
        {/if}
      </span>
    {/each}
    <div class="timer-runtime">{duration.format()}</div>
  </div>
</div>
<div class="timer-actions">
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
  :global(.circledPlay) {
    width: 48px;
  }
  .timer-action {
    margin: 0 8px;
  }

  .timer-actions {
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
  :global(.dashed-timer-leaf > svg) {
    width: 16px;
    stroke-width: 8;
    stroke: #efe8e8;
  }
  :global(.dashed-timer-leaf > path) {
    stroke-dasharray: 16;
  }

  :global(.filled-timer-leaf > svg) {
    width: 16px;
    stroke-width: none;
    stroke: none;
    fill: #efe8e8;
  }
  :global(.filled-timer-leaf > path) {
    stroke-dasharray: none;
  }

  .timer-leaf {
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
