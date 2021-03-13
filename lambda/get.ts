import { APIGatewayProxyEvent } from 'aws-lambda'

exports.handler = async function (event: APIGatewayProxyEvent) {
  console.log('request:', JSON.stringify(event, undefined, 2))

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${event.body}\n`,
  }
}
