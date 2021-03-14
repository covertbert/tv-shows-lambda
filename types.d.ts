declare namespace TVShows {
  type APIResponse = { last_air_date: string }
  type Handler = () => Promise<void>
  type ShowsWithDetails = Promise<
    {
      name: string
      lastAirDate: string
    }[]
  >
}
