import { ShowsWithDetails } from '../types'

type GenerateMessageBody = (shows: ShowsWithDetails) => string
export const generateMessageBody: GenerateMessageBody = shows => {
  if (shows.length < 1) {
    return 'There are currently no TV Shows with any new episodes'
  }

  return `The following TV Shows have new episodes ${shows.join(',')}`
}
