#!/usr/bin/env node
import 'source-map-support/register'
import { App } from '@aws-cdk/core'

import { TvShowsLambdaStack } from '../lib/tv-shows-lambda-stack'

const app = new App()

const apiKey: string | undefined = app.node.tryGetContext('apiKey')
const datadogApiKey: string | undefined = app.node.tryGetContext('datadogApiKey')
const recipientEmails: string | undefined = app.node.tryGetContext('recipientEmails')

if (!apiKey) {
  throw new Error('Missing TV DB API key')
}

if (!recipientEmails) {
  throw new Error('Missing recipient email addresses')
}

if (!datadogApiKey) {
  throw new Error('Missing Datadog API key')
}

new TvShowsLambdaStack(app, 'TvShowsLambdaStack', {
  apiKey,
  datadogApiKey,
  recipientEmails,
  env: {
    region: 'eu-west-2',
    account: '515213366596',
  },
})
