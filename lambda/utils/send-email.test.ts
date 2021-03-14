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

    const expectedShows = [{ name: 'hello', lastAirDate: '1234' }]

    const ses = new SES()
    await sendEmail(expectedShows)

    expect(ses.sendEmail).toHaveBeenCalledWith({
      Destination: { ToAddresses: ['success@simulator.amazonses.com'] },
      Message: {
        Body: { Text: { Data: JSON.stringify(expectedShows) } },
        Subject: { Data: 'Test Email' },
      },
      Source: 'info@bertie.dev',
    })
  })
})
