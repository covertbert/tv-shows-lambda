import { generateMessageBody } from '.'

describe('generateMessageBody', () => {
  it('returns no results text when given an empty array', () => {
    expect(generateMessageBody([])).toEqual('There are currently no TV Shows with any new episodes')
  })

  it('returns a correctly formatted string when given exactly 1 show', () => {
    const shows = [{ name: 'Bugs Bunny', lastAirDate: '2012-11-22' }]

    expect(generateMessageBody(shows)).toEqual('Bugs Bunny has new episodes')
  })

  it('returns a correctly formatted string when given 2 shows', () => {
    const shows = [
      { name: 'Bugs Bunny', lastAirDate: '2012-11-22' },
      { name: 'Donald Duck', lastAirDate: '2014-03-12' },
    ]

    expect(generateMessageBody(shows)).toEqual('Donald Duck & Bugs Bunny have new episodes')
  })

  it('returns a correctly formatted string when given more than 2 shows', () => {
    const shows = [
      { name: 'Bugs Bunny', lastAirDate: '2012-11-22' },
      { name: 'Donald Duck', lastAirDate: '2014-03-12' },
      { name: 'Mickey Mouse', lastAirDate: '2017-01-05' },
    ]

    expect(generateMessageBody(shows)).toEqual(
      'Donald Duck, Mickey Mouse & Bugs Bunny have new episodes',
    )
  })
})
