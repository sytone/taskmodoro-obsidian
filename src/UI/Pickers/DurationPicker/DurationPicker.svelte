<!-- Credits: https://github.com/SharifClick/svelte-duration-timepicker -->
<script lang="ts">
  import Switcher from './Switcher.svelte';
  import moment, { Duration } from 'moment';
  import {
    DurationPickerType,
    SwitcherType,
  } from '../../../Enums/duration-picker-type';

  const worktimeHrs: number[] = new Array(101).fill(0).map((v, i) => i);
  const worktimeMin: number[] = new Array(61).fill(0).map((v, i) => i);
  const pomoLenMin: number[] = new Array(180).fill(1).map((v, i) => v + i);

  export let duration: Duration;
  export let close: () => void;
  export let set: (duration: Duration) => void;
  export let type: DurationPickerType;
  let currValueTitle: string;

  let hSwitcherType: SwitcherType, mSwitcherType: SwitcherType;
  let hSwitcherData: number[], mSwitcherData: number[];
  let hSwitcherSelectedPos: number, mSwitcherSelectedPos: number;

  if (!duration) {
    duration = moment.duration(0, 'minutes');
  }

  $: {
    if (type === DurationPickerType.PomodoroLength) {
      mSwitcherType = SwitcherType.PomoLengthMin;
      mSwitcherData = pomoLenMin;
      mSwitcherSelectedPos = duration.asMinutes();
      currValueTitle = `${mSwitcherSelectedPos}min`;
    } else if (type === DurationPickerType.Worktime) {
      hSwitcherType = SwitcherType.WorktimeHrs;
      hSwitcherData = worktimeHrs;
      hSwitcherSelectedPos = duration.days() * 24 + duration.hours();

      mSwitcherType = SwitcherType.WorktimeMin;
      mSwitcherData = worktimeMin;
      mSwitcherSelectedPos = duration.minutes();
      currValueTitle =
        duration.asMinutes() === 0
          ? 'None'
          : `${hSwitcherSelectedPos}h ${mSwitcherSelectedPos}min`;
    }
    currValueTitle = duration.asMinutes() == 0 ? 'None' : currValueTitle;
  }

  let durationChanged = (event: CustomEvent) => {
    let { switcherType, durInputArg } = event.detail;
    if (switcherType === SwitcherType.WorktimeHrs) {
      duration = moment.duration(duration.minutes(), 'minutes');
      duration = duration.add(durInputArg, 'hours');
    } else if (switcherType === SwitcherType.WorktimeMin) {
      duration = moment.duration(
        duration.days() * 24 + duration.hours(),
        'hours',
      );
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

<div class="taskmodoro duration-picker">
  <div class="value-title">{currValueTitle}</div>
  <div class="switchers-container">
    {#if hSwitcherData}
      <div class="switcher">
        <Switcher
          type={hSwitcherType}
          data={hSwitcherData}
          selectedPos={hSwitcherSelectedPos}
          on:durationChange={durationChanged}
        />
      </div>
    {/if}

    <div class="switcher">
      <Switcher
        type={mSwitcherType}
        data={mSwitcherData}
        selectedPos={mSwitcherSelectedPos}
        on:durationChange={durationChanged}
      />
    </div>
  </div>
  <div class="actions">
    <button class="mod-cta secondary-action-btn" on:click={close}>Cancel</button>
    <button class="mod-cta" on:click={onSet}>Save</button>
  </div>
</div>

<style>
  .switchers-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0px 20px;
  }

  .duration-picker > .actions {
    margin-top: 2rem;
  }

  .duration-picker {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: var(--svtt-font-size, 20px);
    padding: 1.5rem;
  }

  .switcher {
    display: flex;
    padding: 50px 0;
    margin: 10px 0;
    overflow: hidden;
  }

  .duration-picker > .value-title {
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 1rem;
  }
</style>
