/* eslint-disable jest/expect-expect */
import { App } from '@aws-cdk/core'
import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'

import { TvShowsLambdaStack } from './tv-shows-lambda-stack'

describe('TvShowsLambdaStack', () => {
  const apiKey = '123'
  const datadogApiKey = '123'
  const recipientEmails = 'dog@cat.com'

  const app = new App()
  const stack = new TvShowsLambdaStack(app, 'MyTestStack', {
    apiKey,
    datadogApiKey,
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
        Handler: '/opt/nodejs/node_modules/datadog-lambda-js/handler.handler',
        FunctionName: 'email-lambda',
        Tags: [
          {
            Key: 'service',
            Value: 'tv-shows',
          },
        ],
        Timeout: 30,
        TracingConfig: {
          Mode: 'Active',
        },
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
        ScheduleExpression: 'cron(30 10 * * ? *)',
        State: 'ENABLED',
      }),
    )
  })

  test('contains a get lambda with API Gateway & DNS', () => {
    expectCDK(stack).to(
      haveResourceLike('AWS::Lambda::Function', {
        Handler: '/opt/nodejs/node_modules/datadog-lambda-js/handler.handler',
        FunctionName: 'get-lambda',
        Layers: ['arn:aws:lambda:eu-west-2:464622532012:layer:Datadog-Node12-x:50'],
        MemorySize: 256,
        Runtime: 'nodejs12.x',
        Tags: [
          {
            Key: 'service',
            Value: 'tv-shows',
          },
        ],
        Timeout: 30,
        TracingConfig: {
          Mode: 'Active',
        },
        Environment: {
          Variables: {
            DATABASE_API_KEY: apiKey,
            DD_API_KEY: datadogApiKey,
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
        HttpMethod: 'GET',
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
