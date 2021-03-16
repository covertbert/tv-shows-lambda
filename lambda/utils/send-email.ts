import { SES } from 'aws-sdk'

type SendEmail = (messageBody: string, recipientEmails: string) => Promise<SES.SendEmailResponse>
export const sendEmail: SendEmail = (messageBody, recipientEmails) => {
  const ses = new SES({ region: 'us-east-1' })

  const params: SES.Types.SendEmailRequest = {
    Source: 'newtvshows@bertie.dev',
    Message: {
      Body: {
        Text: { Data: messageBody },
      },
      Subject: { Data: 'New TV Show Episodes' },
    },
    Destination: {
      ToAddresses: recipientEmails.split(','),
    },
  }

  return ses.sendEmail(params).promise()
}
