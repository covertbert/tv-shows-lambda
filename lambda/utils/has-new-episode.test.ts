import { set as setDate } from 'mockdate'

import { hasNewEpisode } from '.'

beforeAll(() => {
  setDate('2020-03-22')
})

describe('hasNewEpisode', () => {
  it('returns true when input is less than or equal to 48 hours ago', () => {
    const dateToday = '2020-03-22'
    expect(hasNewEpisode(dateToday)).toEqual(true)
  })

  it('returns true when input is exactly 48 hours ago', () => {
    const dateToday = '2020-03-20'
    expect(hasNewEpisode(dateToday)).toEqual(true)
  })

  it('returns false when input is more than 48 hours ago', () => {
    const dateThreeDaysAgo = '2020-03-19'
    expect(hasNewEpisode(dateThreeDaysAgo)).toEqual(false)
  })
})
