import type { Moment, Duration } from 'moment'

export const formatDate = (date: Moment | undefined): string => {
  if (!date) return
  return date.format('YYYY-MM-DD')
}

export const formatFMDate = (date: Moment): Date => {
  return date.endOf('day').toDate()
}

export const durationFormat_hm =  (dur: Duration): string => {
  let hours = dur.weeks() * 7 + dur.days() * 24 + dur.hours()

  return `${hours}h ${dur?.minutes()}min`
}