import fetch from 'node-fetch'

import { Shows, ShowsWithDetails } from '../types'

type GetShowsWithDetails = (
  tvShows: Shows,
  baseURL: string,
  apiKey: string,
) => Promise<ShowsWithDetails>
export const getShowsWithDetails: GetShowsWithDetails = (tvShows, baseURL, apiKey) =>
  Promise.all(
    tvShows.map(async show => {
      try {
        const response = await fetch(`${baseURL}/${show.id}?api_key=${apiKey}`)
        const showDetails: { last_air_date: string } = JSON.parse(await response.text())

        return { name: show.name, lastAirDate: showDetails.last_air_date }
      } catch (error) {
        throw Error(error)
      }
    }),
  )
