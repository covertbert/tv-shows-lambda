import { Construct, StackProps } from '@aws-cdk/core'
import { Function, Runtime, Code, LayerVersion } from '@aws-cdk/aws-lambda'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import { Role } from '@aws-cdk/aws-iam'

interface ExtendedStackProps extends StackProps {
  lambdaRole: Role
  apiKey: string
  libHoneyApiKey: string
  recipientEmails: string
}

export class EmailLambda extends Construct {
  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id)

    const { lambdaRole, apiKey, libHoneyApiKey, recipientEmails } = props

    const emailLambda = new Function(this, 'EmailMoviesHandler', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('dist'),
      handler: 'email.handler',
      role: lambdaRole,
      layers: [
        LayerVersion.fromLayerVersionArn(
          this,
          'HoneycombLambdaLayer',
          'arn:aws:lambda:eu-west-2:702835727665:layer:honeycomb-lambda-extension:6',
        ),
      ],
      environment: {
        DATABASE_API_KEY: apiKey,
        RECIPIENT_EMAILS: recipientEmails,
        LIBHONEY_DATASET: 'tv-shows-email-lambda',
        LIBHONEY_API_KEY: libHoneyApiKey,
      },
    })

    const emailLambdaTaskTarget = new LambdaFunction(emailLambda)

    new Rule(this, 'ScheduleLambdaRule', {
      schedule: Schedule.cron({ weekDay: 'TUE', hour: '10', minute: '30' }),
      targets: [emailLambdaTaskTarget],
    })
  }
}
