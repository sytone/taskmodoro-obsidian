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
  import PomodoroCompletionSound from '../../../resources/sfx/pomodoro-completion.mp3';
  import { circledPause, circledPlay, circledStop } from '../../graphics';
  import Timer from './Timer.svelte';
  import type PomodoroSessionStore from '../../stores/PomodoroSessionStore';
  const electron = require('electron');

  export let sessionLength: Duration;
  export let plugin: TQPlugin;
  export let file: TFile;
  export let pomodoroSessionStore: PomodoroSessionStore;
  const sessionLeftStore = pomodoroSessionStore.sessionLeft;

  let sessionLeft = sessionLength.clone();
  $: {
    $sessionLeftStore = sessionLeft;
  }
  let sessionProgress: Duration;
  let state = TimerState.INITIALIZED;
  let startedAt: Moment;
  let timer: NodeJS.Timer;

  let markerCnt = 16;
  let markers = Array(markerCnt);

  const playPomodoroCompetionSound = () => {
    const audio = new Audio(PomodoroCompletionSound);
    audio.play();
  };

  const showNotification = () => {
    const Notification = (electron as any).remote.Notification;
    const n = new Notification({
      title: 'Pomodoro session has been completed!',
      silent: false,
      timeoutType: 'never',
    });
    n.on('click', () => {
      n.close();
    });
    n.show();
  };

  const start = (): void => {
    state = TimerState.ONGOING;
    startedAt = moment(new Date());
    sessionProgress = moment.duration();
    timer = setInterval(() => {
      if (sessionLeft.asSeconds() == 0) {
        playPomodoroCompetionSound();
        stop();
      } else {
        sessionLeft = sessionLeft.subtract(1, 'second');
        sessionProgress = sessionProgress.add(1, 'second');
        markers = markers;
      }
    }, 1000);
  };

  const pause = (): void => {
    state = TimerState.PAUSED;
    setTimerActivity();
    clearInterval(timer);
  };

  const stop = (): void => {
    if (TimerState.ONGOING) {
      setTimerActivity();
    }
    showNotification();
    state = TimerState.INITIALIZED;

    clearInterval(timer);
    sessionLeft = sessionLength.clone();
    markers = markers;
    // console.log(duration.asSeconds())
  };

  const setTimerActivity = () => {
    let endedAt = startedAt.clone().add(sessionProgress);
    plugin.fileInterface.setTimerActivity(file, startedAt, endedAt);
  };
</script>

<Timer bind:sessionLeft {sessionLength} {markers} />

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
</style>
