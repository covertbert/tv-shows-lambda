import { handler } from './get'
import { getShowsWithDetails, hasNewEpisode, sendEmail, generateMessageBody } from '../utils'

import { TV_SHOWS, BASE_URL } from '../constants'

const mockTvShow = { lastAirDate: '2012-03-23', name: 'Mr Bean' }

jest.mock('../utils', () => ({
  getShowsWithDetails: jest.fn(() => [mockTvShow]),
  hasNewEpisode: jest.fn(() => true),
  sendEmail: jest.fn(),
  generateMessageBody: jest.fn(),
}))

describe('handler', () => {
  const expectedApiKey = '123456'

  it('throws an error when an API key is missing', async () => {
    await expect(async () => {
      await handler()
    }).rejects.toThrowError('Movie DB API key missing')
  })

  it('calls getShowsWithDetails with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    await handler()

    expect(getShowsWithDetails).toBeCalledWith(TV_SHOWS, BASE_URL, process.env.DATABASE_API_KEY)
  })

  it('calls hasNewEpisode with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    await handler()

    expect(hasNewEpisode).toBeCalledWith(mockTvShow.lastAirDate)
  })

  it('returns the correct shows and totalCount', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const response = await handler()

    expect(JSON.parse(response.body!)).toEqual({
      totalCount: 1,
      shows: [mockTvShow],
    })
  })

  it('returns a 200 code when all is good', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const response = await handler()

    expect(response.statusCode).toEqual(200)
  })
})
