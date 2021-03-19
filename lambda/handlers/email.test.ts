import { handler } from './email'
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
  const expectedEmail = 'dog@cat.com'
  const expectedApiKey = '123456'

  it('throws an error when an API key is missing', async () => {
    await expect(async () => {
      await handler()
    }).rejects.toThrowError('Movie DB API key missing')
  })

  it('throws an error when an recipient addresses are missing', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    await expect(async () => {
      await handler()
    }).rejects.toThrowError('Recipient emails missing')
  })

  it('calls getShowsWithDetails with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(getShowsWithDetails).toBeCalledWith(TV_SHOWS, BASE_URL, process.env.DATABASE_API_KEY)
  })

  it('calls hasNewEpisode with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(hasNewEpisode).toBeCalledWith(mockTvShow.lastAirDate)
  })

  it('calls sendEmail with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(sendEmail).toBeCalledWith(generateMessageBody([mockTvShow]), expectedEmail)
  })

  it('calls generateMessageBody with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(generateMessageBody).toBeCalledWith([mockTvShow])
  })
})
