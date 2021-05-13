import { DynamoDB } from 'aws-sdk'

import { writeShowToDB } from '.'

jest.mock('aws-sdk')

const dynamoMock = DynamoDB as unknown as jest.Mock

afterEach(() => {
  dynamoMock.mockClear()
})

describe('writeShowToDB', () => {
  const input = { name: 'Mr Chong', id: '4321' }

  const putItem = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  })

  it('calls putItem with inputs', async () => {
    dynamoMock.mockImplementationOnce(() => ({
      putItem,
    }))

    const expectedOutput: DynamoDB.Types.PutItemInput = {
      TableName: 'TVShowsTable',
      Item: {
        name: {
          S: input.name,
        },
        id: {
          S: input.id,
        },
      },
    }

    writeShowToDB(input)

    expect(dynamoMock).toHaveBeenCalledWith({ apiVersion: '2012-08-10', region: 'eu-west-2' })

    expect(putItem).toHaveBeenCalledWith(expectedOutput)
  })

  it('throws an error when the db put fails', async () => {
    dynamoMock.mockImplementationOnce(() => ({
      putItem: jest.fn().mockImplementationOnce(() => {
        throw new Error('Big bad error')
      }),
    }))

    await expect(writeShowToDB(input)).rejects.toEqual(new Error('Big bad error'))
  })
})
