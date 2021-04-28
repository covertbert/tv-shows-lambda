import { SES } from 'aws-sdk'

import { sendEmail } from '.'

jest.mock('aws-sdk')

const sesMock = (SES as unknown) as jest.Mock

describe('sendEmail', () => {
  it('calls SES send email with parameters as email body', async () => {
    const sendSesEmail = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        ResponseMetadata: { RequestId: 'abc-123' },
        MessageId: 'cba-321',
      }),
    })

    sesMock.mockImplementationOnce(() => ({
      sendEmail: sendSesEmail,
    }))

    const expectedMessageBody = 'Hello there'
    const expectedEmailAddresses = ['dog@cat.com']

    await sendEmail(expectedMessageBody, expectedEmailAddresses)

    expect(sesMock).toHaveBeenCalledWith({ region: 'us-east-1' })
    expect(sendSesEmail).toHaveBeenCalledWith({
      Destination: { ToAddresses: expectedEmailAddresses },
      Message: {
        Body: { Text: { Data: expectedMessageBody } },
        Subject: { Data: 'New TV Show Episodes' },
      },
      Source: 'newtvshows@bertie.dev',
    })
  })
})
