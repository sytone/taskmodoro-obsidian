<script lang="ts">
	import { circledDone } from './../../Graphics.ts';
  import type { Duration } from 'moment';
  import { timerMarker } from '../../Graphics';
  export let sessionLength: Duration;
  export let sessionLeft: Duration;
  export let markers: any[]

  const markerCnt = markers.length
  
  const rotateVar = (i: number) => `--rotate: ${(i * 360) / markerCnt}deg;`;
  const isMarkerFilled = (markerIndex: number): boolean => {
    let markerDuration = sessionLength.asSeconds() / markerCnt;
    let durFromInitial = sessionLength
      .clone()
      .subtract(sessionLeft.asSeconds(), 'seconds')
      .asSeconds();
    let currMarkerUpperBound = (markerIndex + 1) * markerDuration;
    if (currMarkerUpperBound <= durFromInitial) {
      return true;
    }
    return false;
  };

  $: durationStr =
    sessionLeft.asSeconds() === 0 ? '0:00' : sessionLeft.format();
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

<style>
  .timer-runtime {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--text-normal);
    font-size: 3rem;
  }

  :global(.dashed-timer-marker > svg) {
    width: 16px;
    stroke-width: 8;
  }
  
  :global(.dashed-timer-marker  path) {
    stroke-dasharray: 12 12;
    stroke: var(--text-normal);
  }

  :global(.filled-timer-marker > svg) {
    width: 16px;
  }

  :global(.filled-timer-marker  path) {
    stroke-dasharray: none;
    fill: var(--text-normal);
    stroke: var(--text-normal);
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
