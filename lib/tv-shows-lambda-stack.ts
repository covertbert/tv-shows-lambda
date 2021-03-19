import { Stack, App, StackProps, Duration } from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { Role, ServicePrincipal, PolicyStatement, ManagedPolicy } from '@aws-cdk/aws-iam'
import { Rule, Schedule } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { ARecord, RecordTarget, PublicHostedZone } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { Certificate } from '@aws-cdk/aws-certificatemanager'

interface ExtendedStackProps extends StackProps {
  apiKey: string
  recipientEmails: string
}

export class TvShowsLambdaStack extends Stack {
  constructor(scope: App, id: string, props: ExtendedStackProps) {
    super(scope, id, props)

    const { apiKey, recipientEmails } = props

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

    const emailLambda = new Function(this, 'EmailMoviesHandler', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('dist'),
      handler: 'email.handler',
      role: lambdaRole,
      environment: {
        DATABASE_API_KEY: apiKey,
        RECIPIENT_EMAILS: recipientEmails,
      },
    })

    const emailLambdaTaskTarget = new LambdaFunction(emailLambda)

    new Rule(this, 'ScheduleLambdaRule', {
      schedule: Schedule.cron({ weekDay: 'TUE', hour: '10', minute: '30' }),
      targets: [emailLambdaTaskTarget],
    })

    const getLambda = new Function(this, 'GetMoviesHandler', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('dist'),
      handler: 'get.handler',
      role: lambdaRole,
      environment: {
        DATABASE_API_KEY: apiKey,
        RECIPIENT_EMAILS: recipientEmails,
      },
    })

    const api = new LambdaRestApi(this, 'GetMoviesAPI', {
      handler: getLambda,
      proxy: false,
    })

    api.addDomainName('DomainName', {
      domainName: 'shows.bertie.dev',
      certificate: Certificate.fromCertificateArn(
        this,
        'Certificate',
        'arn:aws:acm:us-east-1:515213366596:certificate/904b7400-ca9a-4f45-8f77-91deccfd79c1',
      ),
    })

    const shows = api.root.addResource('shows')
    shows.addMethod('GET')
    shows.addMethod('POST')

    const zone = PublicHostedZone.fromLookup(this, 'HostedZone', { domainName: 'bertie.dev' })

    new ARecord(this, 'AliasRecord', {
      zone,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      recordName: 'shows.bertie.dev',
      ttl: Duration.seconds(60),
    })
  }
}
