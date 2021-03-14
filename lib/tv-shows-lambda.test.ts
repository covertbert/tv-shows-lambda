import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as TvShowsLambda from './tv-shows-lambda-stack'

test('TvShowsLambdaStack', () => {
  const app = new cdk.App()
  const stack = new TvShowsLambda.TvShowsLambdaStack(app, 'MyTestStack', { apiKey: '123' })

  expectCDK(stack).to(haveResource('AWS::IAM::Role'))
  expectCDK(stack).to(haveResource('AWS::Lambda::Function'))
})
