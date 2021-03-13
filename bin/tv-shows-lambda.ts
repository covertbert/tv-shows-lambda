#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TvShowsLambdaStack } from '../lib/tv-shows-lambda-stack';

const app = new cdk.App();
new TvShowsLambdaStack(app, 'TvShowsLambdaStack');
