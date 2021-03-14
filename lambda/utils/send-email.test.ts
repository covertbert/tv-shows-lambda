import { SES } from 'aws-sdk'

import { sendEmail } from '.'

describe('sendEmail', () => {
  it('calls SES send email', async () => {
    SES.prototype.sendEmail = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        ResponseMetadata: { RequestId: 'abc-123' },
        MessageId: 'cba-321',
      }),
    })

    const ses = new SES()
    await sendEmail([{ name: 'hello', lastAirDate: '1234' }])

    expect(ses.sendEmail).toHaveBeenCalled()
  })
})
