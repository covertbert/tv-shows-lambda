// import { APIGatewayProxyEvent } from 'aws-lambda'
import got from 'got'

exports.handler = async function () {
  const response = await got(
    'https://api.themoviedb.org/3/movie/76341?api_key=bd7dd01f64dfe4718c76a679170134d0',
  )

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${JSON.stringify(response.body)}\n`,
  }
}
