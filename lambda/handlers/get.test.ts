import { handler } from './get'
import { getShowsWithDetails } from '../utils'

import { TV_SHOWS, BASE_URL } from '../constants'

jest.mock('../utils', () => ({
  getShowsWithDetails: jest.fn(() => [
    {
      name: 'Mr Bean',
      lastAirDate: '2012-03-23',
    },
  ]),
  hasNewEpisode: jest.fn(() => true),
}))

describe('handler', () => {
  it('throws an error when an API key is missing', async () => {
    await expect(async () => {
      await handler()
    }).rejects.toThrowError('Movie DB API key missing')
  })

  it('calls getShowsWithDetails with correct inputs', async () => {
    process.env.DATABASE_API_KEY = '123456'

    await handler()

    expect(getShowsWithDetails).toBeCalledWith(TV_SHOWS, BASE_URL, process.env.DATABASE_API_KEY)
  })
})
