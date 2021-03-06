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

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handler', () => {
  const expectedEmails = 'dog@cat.com,cat@cat.com'
  const expectedApiKey = '123456'

  it('throws an error when an API key is missing', async () => {
    await expect(async () => {
      await handler()
    }).rejects.toThrow('Movie DB API key missing')
  })

  it('throws an error when an recipient addresses are missing', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    await expect(async () => {
      await handler()
    }).rejects.toThrow('Recipient emails missing')
  })

  it('calls getShowsWithDetails with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmails

    await handler()

    expect(getShowsWithDetails).toHaveBeenCalledWith(
      TV_SHOWS,
      BASE_URL,
      process.env.DATABASE_API_KEY,
    )
  })

  it('calls hasNewEpisode with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmails

    await handler()

    expect(hasNewEpisode).toHaveBeenCalledWith(mockTvShow.lastAirDate)
  })

  it('does calls sendEmail with correct inputs when showsWithRecentEpisodes > 0', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmails

    await handler()

    expect(sendEmail).toHaveBeenCalledWith(
      generateMessageBody([mockTvShow]),
      expectedEmails.split(','),
    )
  })

  it('does not call sendEmail when showsWithRecentEpisodes < 1', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmails
    ;(hasNewEpisode as jest.Mock).mockReturnValueOnce(false)

    await handler()

    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('calls generateMessageBody with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmails

    await handler()

    expect(generateMessageBody).toHaveBeenCalledWith([mockTvShow])
  })
})
