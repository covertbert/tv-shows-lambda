#!/usr/bin/env node
import 'source-map-support/register'
import { App } from '@aws-cdk/core'

import { TvShowsLambdaStack } from '../lib/tv-shows-lambda-stack'

const app = new App()

const apiKey: string | undefined = app.node.tryGetContext('apiKey')
const recipientEmails: string | undefined = app.node.tryGetContext('recipientEmails')
const versionFromGitHubActions: string | undefined = app.node.tryGetContext(
  'versionFromGitHubActions',
)

if (!apiKey) {
  throw new Error('Missing TV DB API key')
}

if (!recipientEmails) {
  throw new Error('Missing recipient email addresses')
}

new TvShowsLambdaStack(app, 'tv-shows-lambda-stack', {
  apiKey,
  recipientEmails,
  versionFromGitHubActions: versionFromGitHubActions || 'local',
  env: {
    region: 'eu-west-2',
    account: '515213366596',
  },
})
