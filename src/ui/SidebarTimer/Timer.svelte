<script lang="ts">
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
