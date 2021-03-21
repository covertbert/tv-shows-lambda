import { DynamoDB } from 'aws-sdk'

import { writeShowToDB } from '.'

jest.mock('aws-sdk')

const dynamoMock = (DynamoDB as unknown) as jest.Mock

afterEach(() => {
  dynamoMock.mockClear()
})

describe('writeShowToDB', () => {
  const putItem = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  })

  it('calls putItem with inputs', () => {
    dynamoMock.mockImplementationOnce(() => ({
      putItem,
    }))

    const input = { name: 'Mr Chong', id: '4321' }
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

    expect(putItem).toHaveBeenCalledWith(expectedOutput)
  })
})
