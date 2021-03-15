import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as TvShowsLambda from './tv-shows-lambda-stack'

test('TvShowsLambdaStack', () => {
  const app = new cdk.App()
  const stack = new TvShowsLambda.TvShowsLambdaStack(app, 'MyTestStack', { apiKey: '123' })

  expectCDK(stack).to(haveResource('AWS::IAM::Role'))
  expectCDK(stack).to(
    haveResourceLike('AWS::Lambda::Function', {
      Handler: 'get.handler',
    }),
  )
  expectCDK(stack).to(
    haveResourceLike('AWS::Events::Rule', {
      ScheduleExpression: 'cron(* 10 ? * TUE *)',
      State: 'ENABLED',
    }),
  )
})
