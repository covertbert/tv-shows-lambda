import got from 'got'

type GetShowsWithDetails = (
  tvShows: TVShows.Shows,
  baseURL: string,
  apiKey: string,
) => TVShows.ShowsWithDetails

export const getShowsWithDetails: GetShowsWithDetails = (tvShows, baseURL, apiKey) =>
  Promise.all(
    tvShows.map(async movie => {
      const { body } = await got(`${baseURL}/${movie.id}?api_key=${apiKey}`)
      const movieDetails: { last_air_date: string } = JSON.parse(body)

      return { name: movie.name, lastAirDate: movieDetails.last_air_date }
    }),
  )
