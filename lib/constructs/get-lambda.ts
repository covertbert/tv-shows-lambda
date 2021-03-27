import { Construct, StackProps, Duration } from '@aws-cdk/core'
import { Function as AWSLambdaFunction, Runtime, Code, Tracing } from '@aws-cdk/aws-lambda'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { ARecord, RecordTarget, PublicHostedZone } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { Certificate, ValidationMethod } from '@aws-cdk/aws-certificatemanager'
import { Role } from '@aws-cdk/aws-iam'

interface ExtendedStackProps extends StackProps {
  lambdaRole: Role
  apiKey: string
  datadogApiKey: string
}

export class GetLambda extends Construct {
  public readonly function: AWSLambdaFunction

  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id)

    const { lambdaRole, apiKey } = props

    const getLambda = new AWSLambdaFunction(this, 'GetMoviesHandler', {
      functionName: 'get-lambda',
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('dist'),
      handler: 'get.handler',
      timeout: Duration.seconds(30),
      memorySize: 256,
      role: lambdaRole,
      environment: {
        DATABASE_API_KEY: apiKey,
      },
      tracing: Tracing.ACTIVE,
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: 'bertie.dev',
      subjectAlternativeNames: ['*.bertie.dev'],
      validationMethod: ValidationMethod.DNS,
    })

    const getApi = new LambdaRestApi(this, 'GetMoviesAPI', {
      handler: getLambda,
      proxy: false,
    })

    getApi.addDomainName('DomainName', {
      domainName: 'shows.bertie.dev',
      certificate: certificate,
    })

    const shows = getApi.root.addResource('shows')
    shows.addMethod('GET')

    const zone = PublicHostedZone.fromLookup(this, 'HostedZone', { domainName: 'bertie.dev' })

    new ARecord(this, 'AliasRecord', {
      zone,
      target: RecordTarget.fromAlias(new ApiGateway(getApi)),
      recordName: 'shows.bertie.dev',
      ttl: Duration.seconds(60),
    })

    this.function = getLambda
  }
}
