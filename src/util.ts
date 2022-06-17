import { Moment } from 'moment'

export const formatDate = (date: Moment | undefined): string => {
  if (!date) return
  return date.format('YYYY-MM-DD')
}
