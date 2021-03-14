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

    const ses = new SES()
    await sendEmail(expectedMessageBody)

    expect(ses.sendEmail).toHaveBeenCalledWith({
      Destination: { ToAddresses: ['blackmanrgh@gmail.com'] },
      Message: {
        Body: { Text: { Data: expectedMessageBody } },
        Subject: { Data: 'Test Email' },
      },
      Source: 'info@bertie.dev',
    })
  })
})
