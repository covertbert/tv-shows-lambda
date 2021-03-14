import { Stack, App, StackProps } from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, PolicyStatement, ManagedPolicy } from '@aws-cdk/aws-iam'

interface ExtendedStackProps extends StackProps {
  apiKey: string
}

export class TvShowsLambdaStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const { apiKey } = props

    const lambdaRole = new Role(this, 'ExecutionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    })

    lambdaRole.addToPolicy(
      new PolicyStatement({
        resources: ['*'],
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      }),
    )

    lambdaRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    )

    new Function(this, 'GetMoviesHandler', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('dist'),
      handler: 'get.handler',
      role: lambdaRole,
      environment: {
        DATABASE_API_KEY: apiKey,
      },
    })
  }
}
