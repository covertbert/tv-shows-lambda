import { parseISO, differenceInMonths } from 'date-fns'

type HasNewEpisode = (input: string) => boolean
export const hasNewEpisode: HasNewEpisode = input =>
  differenceInMonths(Date.now(), parseISO(input)) <= 1
