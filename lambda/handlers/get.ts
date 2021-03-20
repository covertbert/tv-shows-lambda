import {
  APIGatewayProxyStructuredResultV2,
  APIGatewayProxyEventV2,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda'

import { getShowsWithDetails, hasNewEpisode } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'
import { ShowsWithDetails } from '../types'

export const getBody = (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters | undefined,
  showsWithTheirDetails: ShowsWithDetails,
): string => {
  if (queryStringParameters?.withRecentEpisodes) {
    const withRecentEpisodes = showsWithTheirDetails.filter(show => hasNewEpisode(show.lastAirDate))

    return JSON.stringify({
      totalCount: withRecentEpisodes.length,
      shows: withRecentEpisodes,
    })
  }

  return JSON.stringify({
    totalCount: showsWithTheirDetails.length,
    shows: showsWithTheirDetails,
  })
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const apiKey = process.env.DATABASE_API_KEY

  const { queryStringParameters } = event

  try {
    if (!apiKey) {
      throw new Error('Movie DB API key missing')
    }

    const showsWithTheirDetails = await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey)

    return {
      statusCode: 200,
      headers: {
        'Content-Security-Policy': "Include default-src 'self'",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1',
        'Cache-Control':
          'max-age=0; Expires=-1 or Expires: Fri, 01 Jan 1990 00:00:00 GMT; no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
      body: getBody(queryStringParameters, showsWithTheirDetails),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
    }
  }
}
