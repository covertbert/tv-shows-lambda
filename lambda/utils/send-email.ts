import { SES } from 'aws-sdk'

type SendEmail = (messageBody: string) => Promise<SES.SendEmailResponse>
export const sendEmail: SendEmail = messageBody => {
  const ses = new SES({ region: 'us-east-1' })

  const params: SES.Types.SendEmailRequest = {
    Source: 'info@bertie.dev',
    Message: {
      Body: {
        Text: { Data: messageBody },
      },
      Subject: { Data: 'Test Email' },
    },
    Destination: {
      ToAddresses: ['blackmanrgh@gmail.com'],
    },
  }

  return ses.sendEmail(params).promise()
}
