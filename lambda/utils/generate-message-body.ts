import { ShowsWithDetails } from '../types'

type GenerateMessageBody = (shows: ShowsWithDetails) => string
export const generateMessageBody: GenerateMessageBody = shows => {
  const someShows = shows

  if (!someShows || someShows.length < 1) {
    return 'There are currently no TV Shows with any new episodes.'
  }

  if (someShows.length === 1) {
    return `${someShows[0].name} has new episodes.`
  }

  const firstItem = someShows.filter((_, index) => index === 0)
  const restOfItems = someShows.filter((_, index) => index !== 0)

  return `${restOfItems.map(show => show.name).join(', ')} & ${
    firstItem[0].name
  } have new episodes.`
}
