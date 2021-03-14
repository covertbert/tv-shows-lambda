declare namespace TVShows {
  type ShowsWithDetails = Promise<
    {
      name: string
      lastAirDate: string
    }[]
  >
  type Shows = { name: string; id: string }[]
}
