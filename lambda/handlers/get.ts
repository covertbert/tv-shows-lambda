import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'

import { getShowsWithDetails, hasNewEpisode } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'

export const handler = async (): Promise<APIGatewayProxyStructuredResultV2> => {
  const apiKey = process.env.DATABASE_API_KEY

  try {
    if (!apiKey) {
      throw new Error('Movie DB API key missing')
    }

    const showsWithTheirDetails = await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey)
    const showsWithRecentEpisodes = showsWithTheirDetails.filter(show =>
      hasNewEpisode(show.lastAirDate),
    )

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
      body: JSON.stringify({
        totalCount: showsWithRecentEpisodes.length,
        shows: showsWithRecentEpisodes,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
    }
  }
}
