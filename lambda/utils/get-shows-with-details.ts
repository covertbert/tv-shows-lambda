import fetch from 'node-fetch'

import { Shows, ShowsWithDetails } from '../types'

type GetShowsWithDetails = (
  tvShows: Shows,
  baseURL: string,
  apiKey: string,
) => Promise<ShowsWithDetails>
export const getShowsWithDetails: GetShowsWithDetails = (tvShows, baseURL, apiKey) =>
  Promise.all(
    tvShows.map(async movie => {
      try {
        const response = await fetch(`${baseURL}/${movie.id}?api_key=${apiKey}`)
        const movieDetails: { last_air_date: string } = JSON.parse(await response.text())

        return { name: movie.name, lastAirDate: movieDetails.last_air_date }
      } catch (error) {
        throw Error(error)
      }
    }),
  )
