<!-- Credits: https://github.com/SharifClick/svelte-duration-timepicker -->
<script lang="ts">
  import Switcher from './Switcher.svelte';
  import moment, { Duration } from 'moment';

  const HOURS: number[] = new Array(12).fill(1).map((v, i) => v + i);
  const POMO_LENGTH: number[] = new Array(180).fill(1).map((v, i) => v + i);

  export let duration: Duration;
  export let close: () => void;
  export let set: (duration: Duration) => void;

  let durationChanged = (event: CustomEvent) => {
    let { type, newDurationData } = event.detail;
    if (type === 'POMO_LENGTH') {
      duration = moment.duration(newDurationData, 'minutes');
    }
  };

  const onSet = () => {
    set(duration);
    close();
  };
</script>

<div class="duration-time-wrapper">
  <div class="duration-time">{duration.format()}</div>
  <div class="duration-time-picker">
    <Switcher
      type="POMO_LENGTH"
      data={POMO_LENGTH}
      selected={duration.asMinutes()}
      on:durationChange={durationChanged}
    />
  </div>
  <div class="duration-time-actions">
    <button class="mod-cta secondary-action" on:click={close}>Cancel</button>
    <button class="mod-cta" on:click={onSet}>Save</button>
  </div>
</div>

<style>
  .duration-time-actions {
    margin-top: 2rem;
  }

  .duration-time-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: var(--svtt-font-size, 20px);
    padding: 1.5rem;
  }
  .duration-time-picker {
    display: flex;
    padding: 50px 20px;
    margin: 10px 0;
    overflow: hidden;
  }

  .duration-time {
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 1rem;
  }
</style>
