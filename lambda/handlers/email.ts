import { getShowsWithDetails, hasNewEpisode, sendEmail, generateMessageBody } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'

type Handler = () => Promise<void>

export const handler: Handler = async () => {
  const apiKey = process.env.DATABASE_API_KEY
  const recipientEmails = process.env.RECIPIENT_EMAILS

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  if (!recipientEmails) {
    throw new Error('Recipient emails missing')
  }

  try {
    const showsWithTheirDetails = await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey)
    const showsWithRecentEpisodes = showsWithTheirDetails.filter(show =>
      hasNewEpisode(show.lastAirDate),
    )

    await sendEmail(generateMessageBody(showsWithRecentEpisodes), recipientEmails)
  } catch (error) {
    throw new Error(error)
  }
}
