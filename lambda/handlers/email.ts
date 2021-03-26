import { getShowsWithDetails, hasNewEpisode, sendEmail, generateMessageBody } from '../utils'
import { TV_SHOWS, BASE_URL } from '../constants'
import { ShowsWithDetails } from '../types'

type FilterEmails = (recipientEmails: string, showsWithRecentEpisodes: ShowsWithDetails) => string[]
export const filterEmails: FilterEmails = (recipientEmails, showsWithRecentEpisodes) => {
  const [bertieEmail] = recipientEmails.split(',')
  return showsWithRecentEpisodes.length <= 0 ? [bertieEmail] : [bertieEmail]
}

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

    await sendEmail(
      generateMessageBody(showsWithRecentEpisodes),
      filterEmails(recipientEmails, showsWithRecentEpisodes),
    )
  } catch (error) {
    throw new Error(error)
  }
}
