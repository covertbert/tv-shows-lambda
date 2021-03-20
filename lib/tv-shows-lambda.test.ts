import { App } from '@aws-cdk/core'
import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'

import { TvShowsLambdaStack } from './tv-shows-lambda-stack'

describe('TvShowsLambdaStack', () => {
  const apiKey = '123'
  const recipientEmails = 'dog@cat.com'

  const app = new App()
  const stack = new TvShowsLambdaStack(app, 'MyTestStack', {
    apiKey,
    recipientEmails,
    env: {
      account: '515213366596',
      region: 'eu-west-2',
    },
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

  test('contains a get lambda with API Gateway & DNS', () => {
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

    expectCDK(stack).to(
      haveResourceLike('AWS::ApiGateway::Method', {
        HttpMethod: 'ANY',
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::ApiGateway::DomainName', {
        DomainName: 'shows.bertie.dev',
      }),
    )

    expectCDK(stack).to(
      haveResourceLike('AWS::Route53::RecordSet', {
        Name: 'shows.bertie.dev.',
        Type: 'A',
      }),
    )
  })
})
