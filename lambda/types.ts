export type ShowsWithDetails = Promise<
  {
    name: string
    lastAirDate: string
  }[]
>

export type Shows = { name: string; id: string }[]
