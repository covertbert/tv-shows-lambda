import { hasNewEpisode } from '.'

describe('hasNewEpisode', () => {
  it('returns true when input is less than or equal to 7 days ago', () => {
    const mockDate = new Date()

    expect(hasNewEpisode(mockDate.toISOString().split('T')[0])).toEqual(true)
  })

  it('returns false when input is more than 7 days ago', () => {
    expect(hasNewEpisode('2012-03-29')).toEqual(false)
  })
})
