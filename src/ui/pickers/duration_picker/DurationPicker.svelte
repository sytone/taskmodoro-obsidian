<!-- Credits: https://github.com/SharifClick/svelte-touch-timepicker -->
<script lang="ts">
    import Switcher from './Switcher.svelte';
    import  moment,{Duration} from 'moment';

    const HOURS:number[] = new Array(12).fill(1).map((v, i) => v + i);
    const POMO_LENGTH:number[] = new Array(180).fill(1).map((v, i) => v + i);

    export let duration: Duration;
    export let visible = false;
    export let classes = '';

    let resetDuration = (event: any) => {
      event.stopPropagation()
      duration = moment.duration(30,'minutes');
    }

    let durationChanged = (event: CustomEvent) => {
      let {type,newDurationData} = event.detail;
      if(type==='POMO_LENGTH'){
        duration = moment.duration(newDurationData,'minutes')
      }
    }

</script>

{#if visible}
  <div class="touch-time-popup">
    <div>
      <div class="touch-time-wrapper">
        <div class="touch-time">{duration.format()}</div>
        <div class="touch-time-picker">
          <Switcher
            type="POMO_LENGTH"
            data={POMO_LENGTH}
            selected={duration.asMinutes()}
            on:durationChange={durationChanged}
          />
        </div>
        <div class="touch-time-reset">
          <button on:click={resetDuration}>Reset</button>
          <button
            on:click={() => {
              visible = !visible;
            }}>Ok</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .touch-time-popup {
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    touch-action: pan-down;
  }
  .touch-time-popup > div {
    background: var(--svtt-popup-bg-color, white);
    color: var(--svtt-popup-color, black);
    margin-top: 30vh;
    width: 85%;
    margin-left: 7%;
    border-radius: var(--svtt-popup-radius, 10px);
  }
  .touch-time-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: var(--svtt-font-size, 20px);
    padding: 1.5rem;
  }
  .touch-time-picker {
    display: flex;
    padding: 50px 20px;
    margin: 10px 0;
    overflow: hidden;
  }
  .touch-time-reset > button {
    width: 100px;
    height: 30px;
    border-radius: 15px;
    border: var(--svtt-border, 1px solid grey);
    outline: none;
    color: var(--svtt-button-color, black);
    background-color: var(--svtt-button-bg-color, transparent);
    box-shadow: var(--svtt-button-box-shadow, none);
    font-weight: 300;
  }
  .touch-time-reset button:nth-child(1):active {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
  }
  .touch-time {
    font-size: 30px;
    font-weight: 300;
  }
</style>
