import { Construct, StackProps, Duration } from '@aws-cdk/core'
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda'
import { LambdaRestApi } from '@aws-cdk/aws-apigateway'
import { ARecord, RecordTarget, PublicHostedZone } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { Certificate, ValidationMethod } from '@aws-cdk/aws-certificatemanager'
import { Role } from '@aws-cdk/aws-iam'

interface ExtendedStackProps extends StackProps {
  lambdaRole: Role
  apiKey: string
}

export class GetLambda extends Construct {
  constructor(scope: Construct, id: string, props: ExtendedStackProps) {
    super(scope, id)

    const { lambdaRole, apiKey } = props

    const getLambda = new Function(this, 'GetMoviesHandler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('dist'),
      handler: 'get.handler',
      role: lambdaRole,
      environment: {
        DATABASE_API_KEY: apiKey,
      },
    })

    const api = new LambdaRestApi(this, 'GetMoviesAPI', {
      handler: getLambda,
      proxy: false,
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: 'bertie.dev',
      subjectAlternativeNames: ['*.bertie.dev'],
      validationMethod: ValidationMethod.DNS,
    })

    api.addDomainName('DomainName', {
      domainName: 'shows.bertie.dev',
      certificate: certificate,
    })

    const shows = api.root.addResource('shows')
    shows.addMethod('GET')

    const zone = PublicHostedZone.fromLookup(this, 'HostedZone', { domainName: 'bertie.dev' })

    new ARecord(this, 'AliasRecord', {
      zone,
      target: RecordTarget.fromAlias(new ApiGateway(api)),
      recordName: 'shows.bertie.dev',
      ttl: Duration.seconds(60),
    })
  }
}
