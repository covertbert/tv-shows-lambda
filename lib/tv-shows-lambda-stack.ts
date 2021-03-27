import { Stack, App, StackProps, Tags } from '@aws-cdk/core'
import { Role, ServicePrincipal, PolicyStatement, ManagedPolicy } from '@aws-cdk/aws-iam'
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb'
import { Datadog } from 'datadog-cdk-constructs'

import { EmailLambda } from './constructs/email-lambda'
import { GetLambda } from './constructs/get-lambda'

interface ExtendedStackProps extends StackProps {
  apiKey: string
  datadogApiKey: string
  recipientEmails: string
  versionFromGitHubActions: string
}

export class TvShowsLambdaStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const { apiKey, recipientEmails, datadogApiKey, versionFromGitHubActions } = props

    Tags.of(this).add('service', 'tv-shows')
    Tags.of(this).add('env', 'prod')
    Tags.of(this).add('version', versionFromGitHubActions)

    const datadogForwarderArn =
      'arn:aws:lambda:eu-west-2:515213366596:function:datadog-integration-ForwarderStack-JEQLS-Forwarder-1IA2LYZ68W844'

    const datadog = new Datadog(this, 'DatadogLayer', {
      forwarderARN: datadogForwarderArn,
      apiKey: datadogApiKey,
      nodeLayerVersion: 50,
    })

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

    const emailLambda = new EmailLambda(this, 'EmailLambda', {
      lambdaRole,
      apiKey,
      recipientEmails,
    })
    Tags.of(emailLambda).add('service', 'tv-shows')
    Tags.of(emailLambda).add('env', 'prod')
    Tags.of(emailLambda).add('version', versionFromGitHubActions)

    const getLambda = new GetLambda(this, 'GetLambda', {
      lambdaRole,
      apiKey,
      datadogApiKey,
    })
    Tags.of(getLambda).add('service', 'tv-shows')
    Tags.of(getLambda).add('env', 'prod')
    Tags.of(getLambda).add('version', versionFromGitHubActions)

    datadog.addLambdaFunctions([getLambda.function, emailLambda.function])
  }
}
