#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'

import { TvShowsLambdaStack } from '../lib/tv-shows-lambda-stack'

const app = new cdk.App()

const apiKey: string | undefined = app.node.tryGetContext('apiKey')

if (!apiKey) {
  throw new Error('Missing TV DB API key')
}
new TvShowsLambdaStack(app, 'TvShowsLambdaStack', {
  apiKey,
  env: {
    region: 'eu-west-2',
  },
})
