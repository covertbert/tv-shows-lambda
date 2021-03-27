import { handler, filterEmails } from './email'
import { getShowsWithDetails, hasNewEpisode, sendEmail, generateMessageBody } from '../utils'

import { TV_SHOWS, BASE_URL } from '../constants'
import { ShowsWithDetails } from '../types'

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
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(getShowsWithDetails).toHaveBeenCalledWith(
      TV_SHOWS,
      BASE_URL,
      process.env.DATABASE_API_KEY,
    )
  })

  it('calls hasNewEpisode with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(hasNewEpisode).toHaveBeenCalledWith(mockTvShow.lastAirDate)
  })

  it('calls sendEmail with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(sendEmail).toHaveBeenCalledWith(generateMessageBody([mockTvShow]), [expectedEmail])
  })

  it('calls generateMessageBody with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey
    process.env.RECIPIENT_EMAILS = expectedEmail

    await handler()

    expect(generateMessageBody).toHaveBeenCalledWith([mockTvShow])
  })
})

describe('filterEmails', () => {
  it('only returns the first email when showsWithRecentEpisodes length is zero or less', () => {
    const inputs = 'email1@email.com,email2@email.com'
    const expectedResults = ['email1@email.com']

    const mockShowsWithRecentEpisodes: ShowsWithDetails = []

    expect(filterEmails(inputs, mockShowsWithRecentEpisodes)).toEqual(expectedResults)
  })

  it('only returns the first email when showsWithRecentEpisodes length is more than zero', () => {
    const inputs = 'email1@email.com,email2@email.com'
    const expectedResults = ['email1@email.com']

    const mockShowsWithRecentEpisodes: ShowsWithDetails = [
      { lastAirDate: '2012-11-21', name: 'Mr Bean' },
    ]

    expect(filterEmails(inputs, mockShowsWithRecentEpisodes)).toEqual(expectedResults)
  })
})
