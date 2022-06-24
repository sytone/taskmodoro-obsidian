import { dump, load } from 'js-yaml'
import RRule from 'rrule'
import { FileInterface } from './file-interface'

import moment from 'moment'
import { formatDate } from './util'
type Moment = moment.Moment

export const getDescription = (lines: string[]): string => {
  let descStart = lines.findIndex(line =>
    line.includes(FileInterface.descStartToken),
  )
  let descEnd = lines.findIndex(line =>
    line.includes(FileInterface.descEndToken),
  )
  if (descStart == -1 || descEnd == -1) return ''
  let descLines = lines.slice(descStart + 1, descEnd)
  let description = descLines.join('\n')
  return description
}

export class Frontmatter {
  // TODO: Use index signatures?
  // [s: string]: any

  /**
   * YAML as list of string
   */
  private readonly lines: string[]

  /**
   * Index of the first YAML content line
   */
  private start: number

  /**
   * Index of the last YAML content line
   */
  private end: number

  /**
   * YAML as key value pairs
   */
  private contents: { [k: string]: any }

  constructor (lines: string[]) {
    this.lines = lines
    this.initBoundaries()
    this.parse()
  }

  public readonly contains = (key: string): boolean => key in this.contents
  public readonly get = (key: string): any => this.contents[key]
  public readonly set = (key: string, value: any): void =>
    (this.contents[key] = value)

  public readonly overwrite = (): void => {
    const replacer = (k: string, v: any): any => {
      return moment.isMoment(v)
        ? (v as Moment).endOf('day').format('YYYY-MM-DD')
        : v
    }

    const fmLines = dump(this.contents, { replacer }).trim()

    if (this.start === -1 || this.end === -1) {
      // If there was no frontmatter, add it now
      this.lines.unshift('')
      this.lines.unshift('---')
      this.lines.unshift(fmLines)
      this.lines.unshift('---')
    } else {
      this.lines.splice(this.start, this.end - this.start + 1, fmLines)
    }
  }

  private readonly initBoundaries = (): void => {
    this.start = this.lines.findIndex(line => line === '---') + 1
    if (this.start === 0) {
      console.debug('tq: No frontmatter found for note')
      this.start = -1
      this.end = -1
      return
    }

    this.end =
      this.lines.slice(this.start).findIndex(line => line === '---') +
      this.start -
      1
  }

  /**
   * Serializes YAML string
   */
  private readonly parse = (): void => {
    if (this.start < 0 || this.end < this.start) {
      this.contents = {}
      return
    }
    const fmLines = this.lines.slice(this.start, this.end + 1).join('\n')
    const fm = load(fmLines)
    if (typeof fm === 'string' || typeof fm === 'number') {
      throw new Error('tq: Unexpected type of frontmatter')
    }

    this.contents = fm
  }
}

export const setCompletedDate = (frontmatter: Frontmatter): void => {
  // Add the current date to the 'completed' frontmatter
  const today = window.moment().format('YYYY-MM-DD')
  if (!frontmatter.contains('completed')) {
    frontmatter.set('completed', [today])
    return
  }

  const cur = frontmatter.get('completed')
  if (typeof cur === 'string') {
    frontmatter.set('completed', [cur, today])
  } else if (Array.isArray(cur)) {
    cur.push(today)
  } else {
    console.warn('tq: Unexpected type for completed field in frontmatter')
  }
}

export const setDueDateToNext = (frontmatter: Frontmatter): void => {
  const repeatConfig = frontmatter.get('repeat')
  const repeater = RRule.fromText(repeatConfig)
  const next = repeater.after(
    window.moment
      .utc()
      .endOf('day')
      .toDate(),
  )
  const due = window
    .moment(next)
    .startOf('day')
    .toDate()
  frontmatter.set('due', due)
}
