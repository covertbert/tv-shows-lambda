import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as TvShowsLambda from '../lib/tv-shows-lambda-stack'

test('Empty Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TvShowsLambda.TvShowsLambdaStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT,
    ),
  )
})
