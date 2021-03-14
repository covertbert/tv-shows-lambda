import got from 'got'
import { getShowsWithDetails, hasNewEpisode } from '.'

jest.mock('got', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ body: '{ "last_air_date": "1234" }' })),
}))

describe('getShowsWithDetails', () => {
  const tvShows = [{ name: 'Mr Bean', id: '123456' }]
  const baseURL = 'https://example.com'
  const apiKey = 'abc123'

  it('calls got with the correct inputs', () => {
    getShowsWithDetails(tvShows, baseURL, apiKey)

    const expectedResult = `${baseURL}/${tvShows[0].id}?api_key=${apiKey}`

    expect(got).toBeCalledWith(expectedResult)
  })

  it('returns shows with details when given the correct inputs', async () => {
    const expectedResult = [{ name: tvShows[0].name, lastAirDate: '1234' }]

    expect(await getShowsWithDetails(tvShows, baseURL, apiKey)).toEqual(expectedResult)
  })
})

describe('hasNewEpisode', () => {
  it('returns true when input is less than or equal to 7 days ago', () => {
    const mockDate = new Date()

    expect(hasNewEpisode(mockDate.toISOString().split('T')[0])).toEqual(true)
  })

  it('returns false when input is more than 7 days ago', () => {
    expect(hasNewEpisode('2012-03-29')).toEqual(false)
  })
})
