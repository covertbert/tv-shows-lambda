import { APIGatewayProxyEvent } from 'aws-lambda'

exports.handler = async function (event: APIGatewayProxyEvent) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${event.body}\n`,
  }
}
