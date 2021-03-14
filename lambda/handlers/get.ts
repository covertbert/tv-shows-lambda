import { getShowsWithDetails, hasNewEpisode } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'

type Handler = () => Promise<void>

export const handler: Handler = async () => {
  const apiKey = process.env.DATABASE_API_KEY

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  try {
    const showsWithDetails = await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey)

    const filtered = showsWithDetails.filter(show => hasNewEpisode(show.lastAirDate))

    console.log('HERRO', filtered)
  } catch (error) {
    throw new Error(error)
  }
}
