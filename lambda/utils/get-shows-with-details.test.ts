import fetch from 'node-fetch'
import { getShowsWithDetails } from '.'

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(() =>
    Promise.resolve({ text: () => Promise.resolve('{ "last_air_date": "1234" }') }),
  ),
}))

describe('getShowsWithDetails', () => {
  const tvShows = [{ name: 'Mr Bean', id: '123456' }]
  const baseURL = 'https://example.com'
  const apiKey = 'abc123'

  it('calls got with the correct inputs', () => {
    getShowsWithDetails(tvShows, baseURL, apiKey)

    const expectedResult = `${baseURL}/${tvShows[0].id}?api_key=${apiKey}`

    expect(fetch).toBeCalledWith(expectedResult)
  })

  it('returns shows with details when given the correct inputs', async () => {
    const expectedResult = [{ name: tvShows[0].name, lastAirDate: '1234' }]

    expect(await getShowsWithDetails(tvShows, baseURL, apiKey)).toEqual(expectedResult)
  })

  it('throws an error when API request fails', async () => {
    ;((fetch as unknown) as jest.Mock).mockImplementation(() => {
      throw new Error()
    })

    await expect(async () => {
      await getShowsWithDetails(tvShows, baseURL, apiKey)
    }).rejects.toThrowError()
  })
})
