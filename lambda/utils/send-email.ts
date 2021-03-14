import { ShowsWithDetails } from '../types'

type SendEmail = (shows: ShowsWithDetails) => void
export const sendEmail: SendEmail = () => {
  console.log('hello')
}
