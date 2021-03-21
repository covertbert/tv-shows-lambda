import { DynamoDB } from 'aws-sdk'

import { getShowsFromDB } from '.'

jest.mock('aws-sdk')

const dynamoMock = (DynamoDB as unknown) as jest.Mock

afterEach(() => {
  dynamoMock.mockClear()
})

const mockShow = { name: 'Mr Bean', id: '123456' }

describe('getShowsFromDB', () => {
  const scan = jest.fn().mockReturnValue({
    promise: jest
      .fn()
      .mockResolvedValue({ Items: [{ name: { S: mockShow.name }, id: { S: mockShow.id } }] }),
  })

  it('calls ddb.scan with table name', async () => {
    dynamoMock.mockImplementationOnce(() => ({
      scan,
    }))

    await getShowsFromDB()

    expect(scan).toBeCalledWith({
      TableName: 'TVShowsTable',
    })
  })

  it('calls return shows from db', async () => {
    dynamoMock.mockImplementationOnce(() => ({
      scan,
    }))

    expect(await getShowsFromDB()).toEqual([mockShow])
  })
})
