import { Stack, App, StackProps } from '@aws-cdk/core'
import { Role, ServicePrincipal, PolicyStatement, ManagedPolicy } from '@aws-cdk/aws-iam'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'

import { EmailLambda } from './constructs/email-lambda'
import { GetLambda } from './constructs/get-lambda'

interface ExtendedStackProps extends StackProps {
  apiKey: string
  libHoneyApiKey: string
  recipientEmails: string
}

export class TvShowsLambdaStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const { apiKey, libHoneyApiKey, recipientEmails } = props

    new Table(this, 'Table', {
      tableName: 'TVShowsTable',
      partitionKey: { name: 'id', type: AttributeType.STRING },
    })

    const lambdaRole = new Role(this, 'ExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    })

    lambdaRole.addToPolicy(
      new PolicyStatement({
        resources: ['*'],
        actions: ['ses:SendEmail', 'ses:SendRawEmail', 'dynamodb:*'],
      }),
    )

    lambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    )

    new EmailLambda(this, 'EmailLambda', {
      lambdaRole,
      apiKey,
      libHoneyApiKey,
      recipientEmails,
    })

    new GetLambda(this, 'GetLambda', {
      lambdaRole,
      apiKey,
      libHoneyApiKey,
    })
  }
}
