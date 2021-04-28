import { Construct, StackProps, Duration } from '@aws-cdk/core'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Runtime, Tracing } from '@aws-cdk/aws-lambda'
import {
  RestApi,
  LambdaIntegration,
  LogGroupLogDestination,
  AccessLogFormat,
  MethodLoggingLevel,
} from '@aws-cdk/aws-apigateway'
import { ARecord, RecordTarget, PublicHostedZone } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { Certificate, ValidationMethod } from '@aws-cdk/aws-certificatemanager'
import { Role } from '@aws-cdk/aws-iam'
import { LogGroup, CfnSubscriptionFilter } from '@aws-cdk/aws-logs'

interface ExtendedStackProps extends StackProps {
  lambdaRole: Role
  apiKey: string
}

export class GetLambda extends Construct {
  public readonly function: NodejsFunction

  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id)

    const { lambdaRole, apiKey } = props

    const getLambda = new NodejsFunction(this, 'GetTVShowsHandler', {
      entry: './lambda/handlers/get.ts',
      functionName: 'get-lambda',
      runtime: Runtime.NODEJS_12_X,
      timeout: Duration.seconds(30),
      memorySize: 256,
      role: lambdaRole,
      environment: {
        DATABASE_API_KEY: apiKey,
      },
      tracing: Tracing.ACTIVE,
      bundling: {
        externalModules: ['aws-sdk'],
        sourceMap: true,
      },
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: 'bertie.dev',
      subjectAlternativeNames: ['*.bertie.dev'],
      validationMethod: ValidationMethod.DNS,
    })

    const prodLogGroup = new LogGroup(this, 'ProdLogs', {
      logGroupName: '/api-gateway/tv-shows-api',
    })

    new CfnSubscriptionFilter(this, 'LogsSubscriptionFilter', {
      logGroupName: '/api-gateway/tv-shows-api',
      filterPattern: '',
      destinationArn:
        'arn:aws:lambda:eu-west-2:515213366596:function:datadog-integration-ForwarderStack-JEQLS-Forwarder-1IA2LYZ68W844',
    })

    const api = new RestApi(this, 'TVShowsAPI', {
      restApiName: 'TVShows API',
      description: 'This service returns TV Shows with new episodes',
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(prodLogGroup),
        accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
        loggingLevel: MethodLoggingLevel.INFO,
      },
    })
    api.addDomainName('DomainName', {
      domainName: 'shows.bertie.dev',
      certificate: certificate,
    })

    const getTVShowsIntegration = new LambdaIntegration(getLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    })
    const shows = api.root.addResource('shows')
    shows.addMethod('GET', getTVShowsIntegration)

    const zone = PublicHostedZone.fromLookup(this, 'HostedZone', { domainName: 'bertie.dev' })
    new ARecord(this, 'AliasRecord', {
      zone,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      recordName: 'shows.bertie.dev',
      ttl: Duration.seconds(60),
    })

    this.function = getLambda
  }
}
