import { getShowsWithDetails, hasNewEpisode, sendEmail, generateMessageBody } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'

type Handler = () => Promise<void>

export const handler: Handler = async () => {
  const apiKey = process.env.DATABASE_API_KEY
  const recipientEmails = process.env.RECIPIENT_EMAILS

  try {
    if (!apiKey) {
      throw new Error('Movie DB API key missing')
    }

    if (!recipientEmails) {
      throw new Error('Recipient emails missing')
    }

    const showsWithTheirDetails = await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey)
    const showsWithRecentEpisodes = showsWithTheirDetails.filter(show =>
      hasNewEpisode(show.lastAirDate),
    )

    if (showsWithRecentEpisodes.length > 0) {
      await sendEmail(generateMessageBody(showsWithRecentEpisodes), recipientEmails.split(','))
    }
  } catch (error) {
    throw new Error(error)
  }
}
