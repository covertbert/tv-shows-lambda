import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as TvShowsLambda from './tv-shows-lambda-stack'

test('TvShowsLambdaStack', () => {
  const apiKey = '123'

  const app = new cdk.App()
  const stack = new TvShowsLambda.TvShowsLambdaStack(app, 'MyTestStack', { apiKey })

  expectCDK(stack).to(haveResource('AWS::IAM::Role'))
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
    haveResourceLike('AWS::Events::Rule', {
      ScheduleExpression: 'cron(30 10 ? * TUE *)',
      State: 'ENABLED',
    }),
  )
})
