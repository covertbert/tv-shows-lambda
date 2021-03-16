import { SES } from 'aws-sdk'

import { sendEmail } from '.'

describe('sendEmail', () => {
  it('calls SES send email with parameters as email body', async () => {
    SES.prototype.sendEmail = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        ResponseMetadata: { RequestId: 'abc-123' },
        MessageId: 'cba-321',
      }),
    })

    const expectedMessageBody = 'Hello there'
    const expectedEmailAddresses = 'dog@cat.com'

    const ses = new SES()
    await sendEmail(expectedMessageBody, expectedEmailAddresses)

    expect(ses.sendEmail).toHaveBeenCalledWith({
      Destination: { ToAddresses: [expectedEmailAddresses] },
      Message: {
        Body: { Text: { Data: expectedMessageBody } },
        Subject: { Data: 'New TV Show Episodes' },
      },
      Source: 'newtvshows@bertie.dev',
    })
  })
})
