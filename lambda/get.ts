import { getShowsWithDetails } from './utils'
import { TV_SHOWS, BASE_URL } from './constants'

export const handler: () => Promise<void> = async function () {
  const apiKey = process.env.DATABASE_API_KEY

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  try {
    console.log('HELLO', await getShowsWithDetails(TV_SHOWS, BASE_URL, apiKey))
  } catch (error) {
    throw new Error(error)
  }
}
