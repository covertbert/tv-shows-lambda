import { parseISO, differenceInHours } from 'date-fns'

type HasNewEpisode = (input: string) => boolean
export const hasNewEpisode: HasNewEpisode = input =>
  differenceInHours(Date.now(), parseISO(input)) <= 24
