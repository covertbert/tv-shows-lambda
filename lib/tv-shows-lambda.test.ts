import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as TvShowsLambda from './tv-shows-lambda-stack'

describe('TvShowsLambdaStack', () => {
  const apiKey = '123'
  const recipientEmails = 'dog@cat.com'

  const app = new cdk.App()
  const stack = new TvShowsLambda.TvShowsLambdaStack(app, 'MyTestStack', {
    apiKey,
    recipientEmails,
  })

  it('contains an email lambda with a CloudWatch events trigger', () => {
    expectCDK(stack).to(haveResource('AWS::IAM::Role'))

    expectCDK(stack).to(
      haveResourceLike('AWS::Lambda::Function', {
        Handler: 'email.handler',
        Environment: {
          Variables: {
            RECIPIENT_EMAILS: 'dog@cat.com',
            DATABASE_API_KEY: apiKey,
          },
        },
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::Events::Rule', {
        ScheduleExpression: 'cron(30 10 ? * TUE *)',
        State: 'ENABLED',
      }),
    )
  })

  test('contains a get lambda with API Gateway', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::Lambda::Function', {
        Handler: 'get.handler',
        Environment: {
          Variables: {
            DATABASE_API_KEY: apiKey,
          },
        },
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::ApiGateway::RestApi', {
        Name: 'GetMoviesAPI',
      }),
    )
  })
})
