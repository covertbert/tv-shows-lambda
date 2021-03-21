import { DynamoDB } from 'aws-sdk'

import { getShowsFromDB } from '.'

jest.mock('aws-sdk')

const dynamoMock = (DynamoDB as unknown) as jest.Mock

afterEach(() => {
  dynamoMock.mockClear()
})

describe('getShowsFromDB', () => {
  const scan = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  })

  it('calls ddb.scan with table name', () => {
    dynamoMock.mockImplementationOnce(() => ({
      scan,
    }))

    getShowsFromDB()

    expect(scan).toBeCalledWith({
      TableName: 'TVShowsTable',
    })
  })
})
