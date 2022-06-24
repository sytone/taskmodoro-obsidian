<!-- Credits: https://github.com/SharifClick/svelte-touch-timepicker -->
<script lang="ts">
  import type { SwitcherType } from './../../../enums/duration-picker-type';

  import { afterUpdate, onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let selectedPos: number;
  export let data: number[];
  export let type: SwitcherType;

  let currPosOffsetY = (-selectedPos + 1) * 50;
  let offsetYDelta = 0;
  let dragging = false;
  let itemWrapper: HTMLUListElement, prevOffsetY: any;

  let bias: 0 | 1 = data[0] as 0 | 1;

  onMount(() => {
    applyCurrPosOffset();
  });

  afterUpdate(() => {
    let selectedPositionOffset = (-selectedPos + bias) * 50;
    if (!dragging && currPosOffsetY !== selectedPositionOffset) {
      currPosOffsetY = selectedPositionOffset;
      applyCurrPosOffset();
    }
  });

  function onDurationChange(switcherType: SwitcherType, durInputArg: number) {
    dispatch('durationChange', {
      switcherType,
      durInputArg,
    });
  }

  function applyCurrPosOffset() {
    let itemPosition = `
        will-change: 'transform';
        transition: transform ${Math.abs(offsetYDelta) / 100 + 0.1}s;
        transform: translateY(${currPosOffsetY}px)
      `;
    itemWrapper.style.cssText = itemPosition;
  }

  const onMouseDown = (event: any) => {
    prevOffsetY = event.touches ? event.touches[0].clientY : event.clientY;
    dragging = true;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);
  };

  const setCurrPosOffset = ()=> {
    let maxPosOffsetY = -data.length * 50;
    let newPosOffsetY = currPosOffsetY + offsetYDelta;
    currPosOffsetY = Math.max(maxPosOffsetY, Math.min(50, newPosOffsetY));
  }

  const onWheel = (event: WheelEvent) => {
    let sign = -Math.sign(event.deltaY);
    offsetYDelta = sign * 75;
    setCurrPosOffset()
    prevOffsetY = event.clientY;
    onMouseUp();
  };

  const onMouseMove = (event: any) => {
    let clientY = event.touches ? event.touches[0].clientY : event.clientY;
    offsetYDelta = clientY - prevOffsetY;
    setCurrPosOffset()
    prevOffsetY = clientY;
    applyCurrPosOffset();
  };

  const onMouseUp = () => {
    let maxOffset = (-data.length+1) * 50;
    let currRoundedOffset =
      Math.round((currPosOffsetY + offsetYDelta) / 50) * 50;
    let finalOffset = Math.max(maxOffset, Math.min(0, currRoundedOffset));
    dragging = false;
    currPosOffsetY = finalOffset;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchmove', onMouseMove);
    window.removeEventListener('touchend', onMouseUp);
    applyCurrPosOffset();
    let durInputArg = -finalOffset / 50 + bias;
    onDurationChange(type, durInputArg);
  };
</script>

<div
  class="switcher-items-wrapper"
  on:mousedown={onMouseDown}
  on:touchstart={onMouseDown}
  on:wheel={onWheel}
>
  <ul bind:this={itemWrapper} class="switcher-items">
    {#each data as item}
      <li>{item}</li>
    {/each}
  </ul>
</div>

<style>
  li {
    margin-bottom: 0px;
  }

  .switcher-items-wrapper {
    position: relative;
    height: 50px;
    margin: 0 10px;
    border-top: 1px solid #2c2c2c;
    border-bottom: 1px solid #2c2c2c;
    border-radius: 0;
  }

  .switcher-items {
    margin: 0;
    padding: 0;
  }

  .switcher-items-wrapper:before,
  .switcher-items-wrapper:after {
    content: '';
    position: absolute;
    left: 0;
    width: 80px;
    height: 50px;
    background-color: #2c2c2c;
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
  }

  .switcher-items-wrapper:before {
    top: -51px;
  }

  .switcher-items-wrapper:after {
    bottom: -51px;
  }

  .switcher-items li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 50px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
