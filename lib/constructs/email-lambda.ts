import { Construct, StackProps, Duration } from '@aws-cdk/core'
import { Function as AWSLambdaFunction, Runtime, Code, Tracing } from '@aws-cdk/aws-lambda'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import { Role } from '@aws-cdk/aws-iam'

interface ExtendedStackProps extends StackProps {
  lambdaRole: Role
  apiKey: string
  recipientEmails: string
}

export class EmailLambda extends Construct {
  public readonly function: AWSLambdaFunction

  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id)

    const { lambdaRole, apiKey, recipientEmails } = props

    const emailLambda = new AWSLambdaFunction(this, 'EmailMoviesHandler', {
      functionName: 'email-lambda',
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('dist'),
      handler: 'email.handler',
      timeout: Duration.seconds(30),
      memorySize: 256,
      role: lambdaRole,
      tracing: Tracing.ACTIVE,
      environment: {
        DATABASE_API_KEY: apiKey,
        RECIPIENT_EMAILS: recipientEmails,
      },
    })

    const emailLambdaTaskTarget = new LambdaFunction(emailLambda)

    new Rule(this, 'ScheduleLambdaRule', {
      schedule: Schedule.cron({ hour: '10', minute: '30' }),
      targets: [emailLambdaTaskTarget],
    })

    this.function = emailLambda
  }
}
