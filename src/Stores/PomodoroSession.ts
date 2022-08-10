/* eslint-disable linebreak-style */

import { Writable, writable } from 'svelte/store';
import moment, { Duration } from 'moment';
import { PomodoroSessionType, TimerState } from '../Enums/timer-state';

export default class PomodoroSession {
    public sessionLength: Writable<Duration>;
    public sessionLeft: Writable<Duration>;
    public type: Writable<PomodoroSessionType>;
    public state: Writable<TimerState>;
    constructor(sessionLength: Duration) {
        this.sessionLength = writable(sessionLength);
        this.state = writable(TimerState.INITIALIZED);
        this.type = writable(PomodoroSessionType.WORK);
        this.sessionLeft = writable(moment.duration());
    }
}
