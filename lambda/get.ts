import got from 'got'

const baseURL = 'https://api.themoviedb.org/3/tv'

const tvShows: { name: string; id: string }[] = [
  {
    name: 'succession',
    id: '76331',
  },
]

type GetShowsWithDetails = (apiKey: string) => TVShows.ShowsWithDetails

const getShowsWithDetails: GetShowsWithDetails = apiKey =>
  Promise.all(
    tvShows.map(async movie => {
      const { body } = await got(`${baseURL}/${movie.id}?api_key=${apiKey}`)
      const movieDetails: TVShows.APIResponse = JSON.parse(body)

      return { name: movie.name, lastAirDate: movieDetails.last_air_date }
    }),
  )

export const handler: TVShows.Handler = async function () {
  const apiKey = process.env.DATABASE_API_KEY

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  try {
    console.log('HELLO', await getShowsWithDetails(apiKey))
  } catch (error) {
    throw new Error(error)
  }
}
