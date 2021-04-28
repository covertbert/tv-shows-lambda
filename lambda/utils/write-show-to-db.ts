import { DynamoDB } from 'aws-sdk'

import { Show } from '../types'

type WriteShowToDB = (show: Show) => void

export const writeShowToDB: WriteShowToDB = async show => {
  const ddb = new DynamoDB({ apiVersion: '2012-08-10', region: 'eu-west-2' })

  const params: DynamoDB.Types.PutItemInput = {
    TableName: 'TVShowsTable',
    Item: {
      name: {
        S: show.name,
      },
      id: {
        S: show.id,
      },
    },
  }

  try {
    await ddb.putItem(params).promise()
  } catch (e) {
    throw new Error(e.message)
  }
}
