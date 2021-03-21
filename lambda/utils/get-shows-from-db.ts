import { DynamoDB } from 'aws-sdk'

import { Shows } from '../types'

type GetShowsFromDB = () => Promise<Shows>

export const getShowsFromDB: GetShowsFromDB = async () => {
  const ddb = new DynamoDB({ apiVersion: '2012-08-10', region: 'eu-west-2' })

  const params = {
    TableName: 'TVShowsTable',
  }

  try {
    const { Items: shows } = await ddb.scan(params).promise()

    return shows!.map(show => ({
      id: show.id!.S!,
      name: show.name!.S!,
    }))
  } catch (e) {
    throw new Error(e)
  }
}
