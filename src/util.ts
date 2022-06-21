import type { Moment } from 'moment'

export const formatDate = (date: Moment | undefined): string => {
  if (!date) return
  return date.format('YYYY-MM-DD')
}

export const formatFMDate = (date: Moment): Date => {
  return date.endOf('day').toDate()
}
