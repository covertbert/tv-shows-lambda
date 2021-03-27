import { Construct, StackProps, Duration } from '@aws-cdk/core'
import { Function, Runtime, Code, Tracing } from '@aws-cdk/aws-lambda'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { ARecord, RecordTarget, PublicHostedZone } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { Certificate, ValidationMethod } from '@aws-cdk/aws-certificatemanager'
import { Role } from '@aws-cdk/aws-iam'
import { Datadog } from 'datadog-cdk-constructs'

interface ExtendedStackProps extends StackProps {
  lambdaRole: Role
  apiKey: string
  datadogApiKey: string
}

export class GetLambda extends Construct {
  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id)

    const { lambdaRole, apiKey, datadogApiKey } = props

    const forwarderARN =
      'arn:aws:lambda:eu-west-2:515213366596:function:datadog-integration-ForwarderStack-JEQLS-Forwarder-1IA2LYZ68W844'

    const datadog = new Datadog(this, 'DatadogLayer', {
      forwarderARN,
      apiKey: datadogApiKey,
      nodeLayerVersion: 50,
    })

    const getLambda = new Function(this, 'GetMoviesHandler', {
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

    datadog.addLambdaFunctions([getLambda])

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
  }
}
