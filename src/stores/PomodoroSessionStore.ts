/* eslint-disable linebreak-style */

import moment, { Duration } from 'moment';

import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export default class PomodoroSessionStore {
    public sessionLeft: Writable<Duration>
    constructor(){
      this.sessionLeft=writable(moment.duration())  
    }
}