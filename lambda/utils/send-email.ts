import { SES } from 'aws-sdk'

import { ShowsWithDetails } from '../types'

type SendEmail = (shows: ShowsWithDetails) => Promise<SES.SendEmailResponse>
export const sendEmail: SendEmail = shows => {
  const ses = new SES({ region: 'us-east-1' })

  const params: SES.Types.SendEmailRequest = {
    Source: 'info@bertie.dev',
    Message: {
      Body: {
        Text: { Data: JSON.stringify(shows) },
      },
      Subject: { Data: 'Test Email' },
    },
    Destination: {
      ToAddresses: ['blackmanrgh@gmail.com'],
    },
  }

  return ses.sendEmail(params).promise()
}
