import { Moment, Duration } from 'moment'

export const formatDate = (date: Moment | undefined): string => {
  if (!date) return
  return date.format('YYYY-MM-DD')
}

export const formatFMDate = (date: Moment): Date => {
  return date.endOf('day').toDate()
}

export const durationFormat_hm = (dur: Duration): string => {
  let hrs = Math.round(
    dur
      .clone()
      .subtract(dur.minutes())
      .asHours(),
  )
  let mins = dur.minutes()
  if (hrs > 0) {
    if (mins === 0) {
      return `${hrs}h`
    }
    return `${hrs}h ${mins}min`
  } else {
    return `${mins}min`
  }
}

export const getTextAbv = (text: string, charCnt: number) => {
  if (text.length > charCnt) {
    return text.substring(0, charCnt) + '...'
  } else {
    return text
  }
}
