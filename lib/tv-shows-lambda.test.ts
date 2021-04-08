/* eslint-disable jest/expect-expect */
import { App } from '@aws-cdk/core'
import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'

import { TvShowsLambdaStack } from './tv-shows-lambda-stack'

describe('TvShowsLambdaStack', () => {
  const apiKey = '123'
  const recipientEmails = 'dog@cat.com'
  const versionFromGitHubActions = '1234'

  const app = new App()
  const stack = new TvShowsLambdaStack(app, 'MyTestStack', {
    apiKey,
    recipientEmails,
    versionFromGitHubActions,
    env: {
      account: '515213366596',
      region: 'eu-west-2',
    },
  })

  it('has an IAM role', () => {
    expectCDK(stack).to(haveResource('AWS::IAM::Role'))
  })

  describe('EmailLambda', () => {
    it('has a Cloudwatch Events rule', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Events::Rule', {
          ScheduleExpression: 'cron(30 10 * * ? *)',
          State: 'ENABLED',
        }),
      )
    })

    it('has a lambda with the right handler name', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          Handler: 'email.handler',
          FunctionName: 'email-lambda',
        }),
      )
    })

    it('has a lambda with the right runtime', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'email-lambda',
          Runtime: 'nodejs12.x',
        }),
      )
    })

    it('has a lambda with the right memory allocation', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'email-lambda',
          MemorySize: 256,
        }),
      )
    })

    it('has a lambda with the right stack tags', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'email-lambda',
          Tags: [
            {
              Key: 'env',
              Value: 'prod',
            },
            {
              Key: 'service',
              Value: 'tv-shows',
            },
            {
              Key: 'version',
              Value: '1234',
            },
          ],
        }),
      )
    })

    it('has a lambda with the right timeout', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'email-lambda',
          Timeout: 30,
        }),
      )
    })

    it('has a lambda with the right tracing config', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'email-lambda',
          TracingConfig: {
            Mode: 'Active',
          },
        }),
      )
    })

    it('has a lambda with the right variables', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'email-lambda',
          Environment: {
            Variables: {
              RECIPIENT_EMAILS: 'dog@cat.com',
              DATABASE_API_KEY: apiKey,
            },
          },
        }),
      )
    })
  })

  describe('GetLambda', () => {
    it('has a lambda with the right handler name', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          Handler: 'get.handler',
          FunctionName: 'get-lambda',
        }),
      )
    })

    it('has a lambda with the right runtime', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'get-lambda',
          Runtime: 'nodejs12.x',
        }),
      )
    })

    it('has a lambda with the right memory allocation', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'get-lambda',
          MemorySize: 256,
        }),
      )
    })

    it('has a lambda with the right stack tags', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'get-lambda',
          Tags: [
            {
              Key: 'env',
              Value: 'prod',
            },
            {
              Key: 'service',
              Value: 'tv-shows',
            },
            {
              Key: 'version',
              Value: '1234',
            },
          ],
        }),
      )
    })

    it('has a lambda with the right timeout', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'get-lambda',
          Timeout: 30,
        }),
      )
    })

    it('has a lambda with the right tracing config', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'get-lambda',
          TracingConfig: {
            Mode: 'Active',
          },
        }),
      )
    })

    it('has a lambda with the right variables', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Lambda::Function', {
          FunctionName: 'get-lambda',
          Environment: {
            Variables: {
              DATABASE_API_KEY: apiKey,
            },
          },
        }),
      )
    })

    it('has an API Gateway REST API', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ApiGateway::RestApi', {
          Name: 'TVShows API',
        }),
      )
    })

    it('has Cloudwatch log group', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Logs::LogGroup', {
          LogGroupName: '/api-gateway/tv-shows-api',
        }),
      )
    })

    it('has Cloudwatch log group subscription filter', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Logs::SubscriptionFilter', {
          DestinationArn:
            'arn:aws:lambda:eu-west-2:515213366596:function:datadog-integration-ForwarderStack-JEQLS-Forwarder-1IA2LYZ68W844',
          FilterPattern: '',
          LogGroupName: '/api-gateway/tv-shows-api',
        }),
      )
    })

    it('has an API stage with logging enabled', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ApiGateway::Stage', {
          StageName: 'prod',
          MethodSettings: [
            {
              HttpMethod: '*',
              LoggingLevel: 'INFO',
              ResourcePath: '/*',
            },
          ],
        }),
      )
    })

    it('has an API stage with the correct tags', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ApiGateway::Stage', {
          StageName: 'prod',
          Tags: [
            {
              Key: 'env',
              Value: 'prod',
            },
            {
              Key: 'service',
              Value: 'tv-shows',
            },
            {
              Key: 'version',
              Value: '1234',
            },
          ],
        }),
      )
    })

    it('has an API Gateway GET method', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ApiGateway::Method', {
          HttpMethod: 'GET',
        }),
      )
    })

    it('has an API Gateway domain name', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::ApiGateway::DomainName', {
          DomainName: 'shows.bertie.dev',
        }),
      )
    })

    it('has a Route53 record set', () => {
      expectCDK(stack).to(
        haveResourceLike('AWS::Route53::RecordSet', {
          Name: 'shows.bertie.dev.',
          Type: 'A',
        }),
      )
    })
  })
})
