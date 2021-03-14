import got from 'got'

import { Shows, ShowsWithDetails } from '../types'

type GetShowsWithDetails = (
  tvShows: Shows,
  baseURL: string,
  apiKey: string,
) => ShowsWithDetails | Error

export const getShowsWithDetails: GetShowsWithDetails = (tvShows, baseURL, apiKey) =>
  Promise.all(
    tvShows.map(async movie => {
      try {
        const response = await got(`${baseURL}/${movie.id}?api_key=${apiKey}`)
        const movieDetails: { last_air_date: string } = JSON.parse(response.body)
        return { name: movie.name, lastAirDate: movieDetails.last_air_date }
      } catch (error) {
        throw Error(error)
      }
    }),
  )
