<script lang="ts">
  import type { Moment } from 'moment';

  import {
    dashedTimerLeaf,
    circledPause,
    circledPlay,
    circledStop,
  } from './../graphics';
  let leafCnt = 16;
  const rotateVar = (i: number) => `--rotate: ${(i * 360) / leafCnt}deg;`;
</script>

<div class="timer">
  <div class="timer-container">
    {#each { length: leafCnt } as _, i}
      <span style="{rotateVar(i)} " class="timer-leaf">
        {@html dashedTimerLeaf}
      </span>
    {/each}
    <div class="timer-runtime">30:00</div>
  </div>
</div>
<div class="timer-actions">{@html circledPlay}</div>

<style>
  :global(.circledPlay) {
    width: 48px;
  }

  .timer-actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .timer-runtime {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #efe8e8;
    font-size: 2.25rem;
  }
  :global(.dashed-timer-leaf) {
    width: 16px;
    stroke-width: 8;
    stroke: #efe8e8;
  }
  :global(.dashed-timer-leaf > path) {
    stroke-dasharray: 16;
  }

  .timer-leaf {
    display: flex;
    flex-direction: row;
    justify-content: center;
    grid-area: 1/1;
    transform: rotate(var(--rotate));
  }

  .timer-container {
    position: relative;
    margin: 2rem 1rem;
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
