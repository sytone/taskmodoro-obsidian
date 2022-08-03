<script lang="ts">
  import moment from 'moment';
  import type { Moment } from 'moment';
  import MomentDurationSetup from 'moment-duration-format';
  import { PomodoroSessionType, TimerState } from '../../Enums/timer-state';
  import type { TFile } from 'obsidian';
  import type TQPlugin from '../../main';
  MomentDurationSetup(moment);
  import type { Duration } from 'moment';
  import PomodoroCompletionSound from '../../../resources/sfx/pomodoro-completion.mp3';
  import {
    circledDone,
    circledPause,
    circledPlay,
    circledStop,
  } from '../../Graphics';
  import Timer from './Timer.svelte';
  import type PomodoroSession from '../../Stores/PomodoroSession';
  const electron = require('electron');

  export let workSessionLength: Duration;
  export let plugin: TQPlugin;
  export let file: TFile;
  export let pomodoroSession: PomodoroSession;
  const sessionLeftStore = pomodoroSession.sessionLeft;
  const sessionLengthStore = pomodoroSession.sessionLength
  
  const restSessionsLenghts = [5, 5, 5, 15];
  let sessionIndex = 0;
  let sessionLeft = workSessionLength.clone();
  $: {
    $sessionLeftStore = sessionLeft;
  }
  let state = pomodoroSession.state;
  let type = pomodoroSession.type;
  let startedAt: Moment;
  let timer: NodeJS.Timer;

  let markerCnt = 16;
  let markers = Array(markerCnt);

  const playPomodoroCompetionSound = () => {
    const audio = new Audio(PomodoroCompletionSound);
    audio.play();
  };

  const playBreakCompetionSound = () => {
    const audio = new Audio(PomodoroCompletionSound);
    audio.play();
  };

  const showNotification = (title: string, body: string) => {
    const Notification = (electron as any).remote.Notification;
    const n = new Notification({
      title: title,
      body: body,
      silent: true,
      timeoutType: 'default',
    });
    n.on('click', () => {
      n.close();
    });
    n.show();
  };

  const setTimerActivity = () => {
    if ($type === PomodoroSessionType.WORK) {
      let endedAt = moment()
      plugin.fileInterface.setTimerActivity(file, startedAt, endedAt);
    }
  };

  const handleWorkSessionDone = () => {
    const title = 'Pomodoro has been completed!';
    const body = "Pomodoro has been completed, it's time to rest!";
    showNotification(title, body);
    playPomodoroCompetionSound();
    setTimerActivity();
    const newSessionLength = restSessionsLenghts[sessionIndex];
    sessionLeft = moment.duration(newSessionLength, 'minutes');
    
    sessionIndex = (sessionIndex + 1) % 4;
    $type=PomodoroSessionType.REST
  };

  const handleRestSessionDone = () => {
    const title = 'Break has been ended!';
    const body = "Break has been ended, it's time to get back to work!";
    showNotification(title, body);
    playBreakCompetionSound();
    sessionLeft = workSessionLength.clone();
    $type=PomodoroSessionType.WORK
  };

  const start = (): void => {
    $state = TimerState.ONGOING;
    startedAt = moment(new Date());
    timer = setInterval(() => {
      if (sessionLeft.asSeconds() == 0) {
        done();
      } else {
        sessionLeft = sessionLeft.subtract(1, 'second');
        markers = markers;
      }
    }, 1000);
  };

  const pause = (): void => {
    $state = TimerState.PAUSED;
    setTimerActivity();
    clearInterval(timer);
  };


  const done = (): void => {
    $state = TimerState.DONE;
    clearInterval(timer);
    if ($type === PomodoroSessionType.WORK) {
      handleWorkSessionDone();
    } else {
      handleRestSessionDone();
    }
    markers = markers;
    $sessionLengthStore = sessionLeft.clone()
  };

  const stop = (): void => {
    setTimerActivity();

    clearInterval(timer);
    if ($type === PomodoroSessionType.REST) {
      $type = PomodoroSessionType.WORK;
    }
    $state = TimerState.INITIALIZED;
    sessionLeft = workSessionLength.clone();
    $sessionLengthStore = sessionLeft.clone()
    markers = markers;
  };
</script>

<Timer bind:sessionLeft sessionLength={$sessionLengthStore} {markers} />

<div class="timer-actions-container">
  {#if $state == TimerState.INITIALIZED || $state == TimerState.DONE}
    <div class="timer-action" on:click={start}>{@html circledPlay}</div>
  {/if}
  {#if $state == TimerState.ONGOING && $type === PomodoroSessionType.WORK}
    <div class="timer-action" on:click={pause}>{@html circledPause}</div>
  {/if}
  {#if $state == TimerState.ONGOING && $type === PomodoroSessionType.REST}
    <div class="timer-action" on:click={stop}>{@html circledDone}</div>
  {/if}
  {#if $state == TimerState.PAUSED}
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

  :global(.timer-action circle, .timer-action rect,.timer-action path){
    fill: transparent;
    stroke: var(--text-normal)
  }


  :global(.timer-action .circle-play) {
    width: 48px;
  }

</style>
