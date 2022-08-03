import type { Duration, Moment } from 'moment'

export const formatDate = (date: Moment | undefined): string => {
  if (!date) return
  return date.format('YYYY-MM-DD')
}

export const formatFMDate = (date: Moment): Date => date.endOf('day').toDate()

export const durationFormat = (dur: Duration): string => {
  const hrs = Math.round(
    dur
      .clone()
      .subtract(dur.minutes(),'minutes')
      .asHours(),
  )
  const mins = dur.minutes()
  if (hrs > 0) {
    if (mins === 0) {
      return `${hrs}h`
    }
    return `${hrs}h ${mins}min`
  }
  return `${mins}min`

}

export const getTextAbv = (text: string, charCnt: number): string => {
  if (text.length > charCnt) {
    return text.substring(0, charCnt) + '...'
  }
  return text

}
