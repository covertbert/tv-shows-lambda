import { getShowsWithDetails, hasNewEpisode, sendEmail } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'

type Handler = () => Promise<void>

export const handler: Handler = async () => {
  const apiKey = process.env.DATABASE_API_KEY

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  try {
    const showsWithTheirDetails = await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey)
    const showsWithRecentEpisodes = showsWithTheirDetails.filter(show =>
      hasNewEpisode(show.lastAirDate),
    )

    await sendEmail(showsWithRecentEpisodes)
  } catch (error) {
    throw new Error(error)
  }
}
