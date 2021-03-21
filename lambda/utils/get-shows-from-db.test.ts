import { DynamoDB } from 'aws-sdk'

import { getShowsFromDB } from '.'

jest.mock('aws-sdk')

const dynamoMock = (DynamoDB as unknown) as jest.Mock

afterEach(() => {
  dynamoMock.mockClear()
})

describe('getShowsFromDB', () => {
  const scan = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue([{ name: { S: 'Mr Bean' }, id: { S: '123456' } }]),
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

  // it('calls return shows from db', async () => {
  //   dynamoMock.mockImplementationOnce(() => ({
  //     scan,
  //   }))

  //   expect(await getShowsFromDB()).toEqual('')
  // })
})
