import got from 'got'

exports.handler = async function () {
  const movies: { name: string; id: string }[] = [
    {
      name: 'succession',
      id: '76331',
    },
  ]

  const apiKey = process.env.DATABASE_API_KEY

  if (!apiKey) {
    throw new Error('Movie DB API key missing')
  }

  try {
    const moviesWithDetails = Promise.all(
      movies.map(async movie => {
        const { body } = await got(`https://api.themoviedb.org/3/tv/${movie.id}?api_key=${apiKey}`)
        const movieDetails: TVShows.Response = JSON.parse(body)

        return { name: movie.name, lastAirDate: movieDetails.last_air_date }
      }),
    )

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(await moviesWithDetails),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'A BIG ERROR',
    }
  }
}
