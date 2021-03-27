import { APIGatewayProxyEventV2 } from 'aws-lambda'

import { handler, getBody } from './get'
import { getShowsWithDetails, hasNewEpisode, getShowsFromDB } from '../utils'

import { TV_SHOWS, BASE_URL } from '../constants'

const mockTvShow1 = { lastAirDate: '2012-03-23', name: 'Mr Bean' }
const mockTvShow2 = { lastAirDate: '2014-06-23', name: 'Mr Chong' }
const mockAPIGatewayProxyEvent = {} as APIGatewayProxyEventV2

const mockShowFromDB = { name: 'Mr Bean', id: '12345' }

jest.mock('../utils', () => ({
  getShowsWithDetails: jest.fn(() => [mockTvShow1, mockTvShow2]),
  hasNewEpisode: jest.fn(lastAirDate => parseInt(lastAirDate.split('-')[0]) < 2014),
  sendEmail: jest.fn(),
  generateMessageBody: jest.fn(),
  getShowsFromDB: jest.fn(() => [mockShowFromDB]),
}))

describe('handler', () => {
  const expectedApiKey = '123456'

  it('returns an error when an API key is missing', async () => {
    const response = await handler(mockAPIGatewayProxyEvent)

    expect(response.body).toEqual('"Internal server error"')
  })

  it('calls getShowsWithDetails with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    await handler(mockAPIGatewayProxyEvent)

    expect(getShowsWithDetails).toHaveBeenCalledWith(
      [mockShowFromDB],
      BASE_URL,
      process.env.DATABASE_API_KEY,
    )
  })

  it('calls getShowsFromDB with correct inputs', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    await handler(mockAPIGatewayProxyEvent)

    expect(getShowsFromDB).toHaveBeenCalled()
  })

  it('returns the correct shows and totalCount when given no params', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const response = await handler(mockAPIGatewayProxyEvent)

    expect(JSON.parse(response.body!)).toEqual({
      totalCount: 2,
      shows: [mockTvShow1, mockTvShow2],
    })
  })

  it('returns the correct shows and totalCount when given some params', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const params = ({
      queryStringParameters: { withRecentEpisodes: 'true' },
    } as unknown) as APIGatewayProxyEventV2

    const response = await handler(params)

    expect(JSON.parse(response.body!)).toEqual({
      totalCount: 1,
      shows: [mockTvShow1],
    })
  })

  it('returns a 200 code when all is good', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const response = await handler(mockAPIGatewayProxyEvent)

    expect(response.statusCode).toEqual(200)
  })
})

describe('getBody', () => {
  const expectedApiKey = '123456'

  const showsWithTheirDetails = [mockTvShow1, mockTvShow2]

  it('calls hasNewEpisode with correct inputs when withRecentEpisodes is true', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const queryStringParameters = { withRecentEpisodes: 'true' }

    getBody(queryStringParameters, showsWithTheirDetails)

    expect(hasNewEpisode).toHaveBeenCalledWith(mockTvShow1.lastAirDate)
  })

  it('returns body containing filtered shows when withRecentEpisodes is true', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const queryStringParameters = { withRecentEpisodes: 'true' }

    const stringifiedBody = JSON.stringify({
      totalCount: 1,
      shows: [mockTvShow1],
    })

    expect(getBody(queryStringParameters, showsWithTheirDetails)).toEqual(stringifiedBody)
  })

  it('returns body containing all shows when no query params', async () => {
    process.env.DATABASE_API_KEY = expectedApiKey

    const queryStringParameters = {}

    const stringifiedBody = JSON.stringify({
      totalCount: 2,
      shows: [mockTvShow1, mockTvShow2],
    })

    expect(getBody(queryStringParameters, showsWithTheirDetails)).toEqual(stringifiedBody)
  })
})
