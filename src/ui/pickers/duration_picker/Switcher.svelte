<!-- Credits: https://github.com/SharifClick/svelte-touch-timepicker -->
<script lang="ts">
  import { afterUpdate, onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let selected: number;
  export let data: number[];
  export let type: 'POMO_LENGTH';

  let currOffset = selected ? (-selected+1) * 50 : 0;
  let offsetChange = 0;
  let dragging = false;
  let itemWrapper: HTMLUListElement, previousY: any;

  onMount(() => {
    setCurrPositionOffset();
  });

  afterUpdate(() => {
    let selectedPositionOffset = (-selected+1) * 50;
    // console.log('sPos: ', selectedPosition);
    if (!dragging && currOffset !== selectedPositionOffset) {
      currOffset = selectedPositionOffset;
      setCurrPositionOffset();
    }
  });

  function onDurationChange(type: string, newDurationData: number) {
    dispatch('durationChange', {
      type,
      newDurationData: newDurationData,
    });
  }

  function setCurrPositionOffset() {
    let itemPosition = `
        will-change: 'transform';
        transition: transform ${Math.abs(offsetChange) / 100 + 0.1}s;
        transform: translateY(${currOffset}px)
      `;
    itemWrapper.style.cssText = itemPosition;
  }

  const onMouseDown = (event: any) => {
    previousY = event.touches ? event.touches[0].clientY : event.clientY;
    dragging = true;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);
  };

  const onMouseMove = (event: any) => {
    let clientY = event.touches ? event.touches[0].clientY : event.clientY;
    offsetChange = clientY - previousY;
    let maxPosition = -data.length * 50;
    
    let _position = currOffset + offsetChange;
    console.log('pos:', currOffset, ' offset: ', offsetChange);
    currOffset = Math.max(maxPosition, Math.min(50, _position));
    previousY = event.touches ? event.touches[0].clientY : event.clientY;
    setCurrPositionOffset();
  };

  const onMouseUp = () => {
    let maxOffset = -(data.length - 1) * 50;
    let currRoundedOffset = Math.round((currOffset + offsetChange * 5) / 50) * 50;
    let finalOffset = Math.max(maxOffset, Math.min(0, currRoundedOffset));
    console.log('rPos:', currRoundedOffset, ' fPos: ', finalOffset);
    dragging = false;
    currOffset = finalOffset;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('touchmove', onMouseMove);
    window.removeEventListener('touchend', onMouseUp);
    setCurrPositionOffset();
    let newDurationData = (-finalOffset / 50)+1
    onDurationChange(type, newDurationData  );
  };
</script>

<div
  class="touch-time-wrapper"
  on:mousedown={onMouseDown}
  on:touchstart={onMouseDown}
>
  <ul bind:this={itemWrapper} class="touch-time-container">
    {#each data as item}
      <li>{item}</li>
    {/each}
  </ul>
</div>

<style>
  li {
    margin-bottom: 0px;
  }

  .touch-time-wrapper {
    position: relative;
    height: 50px;
    margin: 0 10px;
    border-top: 1px solid var(--svtt-bar-color, grey);
    border-bottom: 1px solid var(--svtt-bar-color, grey);
    border-radius: 0;
  }

  .touch-time-container {
    margin: 0;
    padding: 0;
  }

  .touch-time-wrapper:before,
  .touch-time-wrapper:after {
    content: '';
    position: absolute;
    left: 0;
    width: 80px;
    height: 50px;
    background-color: #fff;
    opacity: 0.8;
    pointer-events: none;
    z-index: 1;
  }

  .touch-time-wrapper:before {
    top: -51px;
  }

  .touch-time-wrapper:after {
    bottom: -51px;
  }

  .touch-time-container li {
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
