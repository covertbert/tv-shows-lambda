import { differenceInDays, parseISO } from 'date-fns'

type HasNewEpisode = (input: string) => boolean
export const hasNewEpisode: HasNewEpisode = input =>
  differenceInDays(Date.now(), parseISO(input)) <= 7
