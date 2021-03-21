import { TV_SHOWS } from '../lambda/constants'
import { writeShowToDB } from '../lambda/utils'

TV_SHOWS.forEach(show => {
  writeShowToDB({ name: show.name, id: show.id })
})
