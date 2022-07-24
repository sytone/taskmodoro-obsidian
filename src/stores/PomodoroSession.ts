/* eslint-disable linebreak-style */

import { PomodoroSessionType, TimerState } from '../enums/timer-state'
import { Writable, writable } from 'svelte/store'
import moment, { Duration } from 'moment'

export default class PomodoroSession {
  public sessionLength: Writable<Duration>
  public sessionLeft: Writable<Duration>
  public type: Writable<PomodoroSessionType>
  public state: Writable<TimerState>
  constructor (sessionLength: Duration) {
    this.sessionLength = writable(sessionLength)
    this.state = writable(TimerState.INITIALIZED)
    this.type = writable(PomodoroSessionType.WORK)
    this.sessionLeft = writable(moment.duration())
  }
}
