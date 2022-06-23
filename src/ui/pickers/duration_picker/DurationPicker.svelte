<!-- Credits: https://github.com/SharifClick/svelte-duration-timepicker -->
<script lang="ts">
  import Switcher from './Switcher.svelte';
  import moment, { Duration } from 'moment';
  import {
    DurationPickerType,
    SwitcherType,
  } from './../../../enums/duration-picker-type';

  const worktimeHrs: number[] = new Array(100).fill(0).map((v, i) => i);
  const worktimeMin: number[] = new Array(61).fill(0).map((v, i) => i);
  const pomoLenMin: number[] = new Array(180).fill(1).map((v, i) => v + i);

  export let duration: Duration;
  export let close: () => void;
  export let set: (duration: Duration) => void;
  export let type: DurationPickerType;
  let title: string;

  let switcher1Type: SwitcherType, switcher2Type: SwitcherType;
  let switcher1Data: number[], switcher2Data: number[];

  // Reactive only for title
  $: {
    if (type === DurationPickerType.PomodoroLength) {
      title = `${duration.asMinutes()}min`;
      switcher2Type = SwitcherType.PomoLengthMin;
      switcher2Data = pomoLenMin;
    } else if (type === DurationPickerType.EstimatedWorktime) {
      title =
        duration.asMinutes() === 0
          ? 'None'
          : `${
              duration.days() * 24 + duration.hours()
            }h ${duration.minutes()}min`;

      switcher1Type = SwitcherType.WorktimeHrs;
      switcher1Data = worktimeHrs;
      switcher2Type = SwitcherType.WorktimeMin;
      switcher2Data = worktimeMin;
    }
    title = duration.asMinutes() == 0 ? 'None' : title;
  }

  let durationChanged = (event: CustomEvent) => {
    let { switcherType, durInputArg } = event.detail;
    if (switcherType === SwitcherType.WorktimeHrs) {
      duration = moment.duration(duration.minutes(), 'minutes');
      duration = duration.add(durInputArg, 'hours');
    } else if (switcherType === SwitcherType.WorktimeMin) {
      duration = moment.duration(duration.hours(), 'hours');
      duration = duration.add(durInputArg, 'minutes');
    } else if (switcherType === SwitcherType.PomoLengthMin) {
      duration = moment.duration(durInputArg, 'minutes');
    }
  };

  const onSet = () => {
    set(duration);
    close();
  };
</script>

<div class="duration-wrapper">
  <div class="duration">{title}</div>
  <div class="duration-picker-wrapper">
    {#if switcher1Data}
    <div class="duration-picker">
        <Switcher
          type={switcher1Type}
          data={switcher1Data}
          selectedPos={duration.hours()}
          on:durationChange={durationChanged}
        />
      </div>
      {/if}

    <div class="duration-picker">
      <Switcher
        type={switcher2Type}
        data={switcher2Data}
        selectedPos={duration.minutes()}
        on:durationChange={durationChanged}
      />
    </div>
  </div>
  <div class="duration-actions">
    <button class="mod-cta secondary-action" on:click={close}>Cancel</button>
    <button class="mod-cta" on:click={onSet}>Save</button>
  </div>
</div>

<style>
  .duration-picker-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0px 20px;
  }
  .duration-actions {
    margin-top: 2rem;
  }

  .duration-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: var(--svtt-font-size, 20px);
    padding: 1.5rem;
  }
  .duration-picker {
    display: flex;
    padding: 50px 0;
    margin: 10px 0;
    overflow: hidden;
  }

  .duration {
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 1rem;
  }
</style>
