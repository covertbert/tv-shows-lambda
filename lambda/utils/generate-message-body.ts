import { ShowsWithDetails } from '../types'

type GenerateMessageBody = (shows: ShowsWithDetails) => string
export const generateMessageBody: GenerateMessageBody = shows => {
  const someShows = shows

  if (!someShows || someShows.length < 1) {
    return 'There are currently no TV Shows that you watch with any new episodes.'
  }

  if (someShows.length === 1) {
    return `${someShows[0].name} has new episodes.`
  }

  const firstItem = someShows[0]
  const [, ...restOfItems] = someShows

  return `${restOfItems.map(show => show.name).join(', ')} & ${firstItem.name} have new episodes.`
}
