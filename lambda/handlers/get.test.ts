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

  it('calls hasNewEpisode with correct inputs', async () => {
    process.env.DATABASE_API_KEY = '123456'

    await handler()

    expect(hasNewEpisode).toBeCalledWith(mockTvShow.lastAirDate)
  })

  it('calls sendEmail with correct inputs', async () => {
    process.env.DATABASE_API_KEY = '123456'

    await handler()

    expect(sendEmail).toBeCalledWith(generateMessageBody([mockTvShow]))
  })

  it('calls generateMessageBody with correct inputs', async () => {
    process.env.DATABASE_API_KEY = '123456'

    await handler()

    expect(generateMessageBody).toBeCalledWith([mockTvShow])
  })
})
