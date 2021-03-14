import got from 'got'

const tvShows: { name: string; id: string }[] = [
  {
    name: 'succession',
    id: '76331',
  },
]

export const handler: TVShows.Handler = async function () {
  const apiKey = process.env.DATABASE_API_KEY

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  try {
    const tvShowsWithDetails: TVShows.ShowsWithDetails = Promise.all(
      tvShows.map(async movie => {
        const { body } = await got(`https://api.themoviedb.org/3/tv/${movie.id}?api_key=${apiKey}`)
        const movieDetails: TVShows.APIResponse = JSON.parse(body)

        return { name: movie.name, lastAirDate: movieDetails.last_air_date }
      }),
    )

    console.log('HELLO', await tvShowsWithDetails)
  } catch (error) {
    throw new Error(error)
  }
}
