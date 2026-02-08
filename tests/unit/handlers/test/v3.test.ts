import httpStatus from 'http-status';
import { handler } from '../../../../src/handlers/test/v3';
import { createApi } from '../../../../src/utils/axios';
import { ddbDocClient } from '../../../../src/models/dynamodb';
import { ResponseMessage } from '../../../../src/common/response.interface';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

jest.mock('../../../../src/utils/axios', () => ({
  createApi: jest.fn(),
}));

jest.mock('../../../../src/models/dynamodb', () => ({
  ddbDocClient: {
    send: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockedCreateApi = createApi as jest.Mock;
const mockedSend = ddbDocClient.send as jest.Mock;
const mockedUuid = uuid as jest.Mock;

const baseEvent: APIGatewayProxyEvent = {
  body: JSON.stringify({ title: 'Test task', completed: false }),
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: '',
};

const context: Context = {} as Context;

describe('handler – 100% coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.DYNAMODB_TABLE_NAME = 'test-table';
    process.env.TEST_AXIOS_ENDPOINT = 'https://api.test.com';

    mockedUuid.mockReturnValue('uuid-123');

    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2025-01-01T00:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns BAD_REQUEST when axios returns no data (gated error)', async () => {
    mockedCreateApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: null,
      }),
    });

    const result = await handler(baseEvent, context);

    expect(result.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body)).toEqual({
      error: 'No data received',
    });

    expect(mockedSend).not.toHaveBeenCalled();
  });

  it('creates record, writes to DynamoDB, and returns SUCCESS', async () => {
    mockedCreateApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: 'remote data',
        },
      }),
    });

    mockedSend.mockResolvedValue({});

    const result = await handler(baseEvent, context);

    // axios OR branch covered
    expect(createApi).toHaveBeenCalledWith({
      baseURL: 'https://api.test.com',
    });

    // DynamoDB write
    expect(mockedSend).toHaveBeenCalledWith(expect.any(PutCommand));

    const putCommand = mockedSend.mock.calls[0][0] as PutCommand;
    expect(putCommand.input).toEqual({
      TableName: 'test-table',
      Item: {
        taskId: 'uuid-123',
        title: 'Test task',
        completed: false,
        createdAt: '2025-01-01T00:00:00.000Z',
        data: {
          id: 1,
          name: 'remote data',
        },
      },
    });

    // final response
    expect(result.statusCode).toBe(httpStatus.OK);
    expect(JSON.parse(result.body)).toEqual({
      data: ResponseMessage.SUCCESS,
    });
  });

  it('falls back to empty baseURL when TEST_AXIOS_ENDPOINT is undefined', async () => {
    delete process.env.TEST_AXIOS_ENDPOINT;

    mockedCreateApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: { ok: true },
      }),
    });

    mockedSend.mockResolvedValue({});

    await handler(baseEvent, context);

    expect(createApi).toHaveBeenCalledWith({
      baseURL: '',
    });
  });

  it('handles DynamoDB send failure and throws error', async () => {
    mockedCreateApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: { id: 1, name: 'test' },
      }),
    });

    const dbError = new Error('DynamoDB write failed');
    mockedSend.mockRejectedValue(dbError);

    await expect(handler(baseEvent, context)).rejects.toThrow('DynamoDB write failed');
  });

  it('handles axios get request failure', async () => {
    const apiError = new Error('API request failed');
    mockedCreateApi.mockReturnValue({
      get: jest.fn().mockRejectedValue(apiError),
    });

    await expect(handler(baseEvent, context)).rejects.toThrow('API request failed');
  });

  it('includes correct endpoint in axios get call', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: { id: 1 },
    });

    mockedCreateApi.mockReturnValue({
      get: mockGet,
    });

    mockedSend.mockResolvedValue({});

    await handler(baseEvent, context);

    expect(mockGet).toHaveBeenCalledWith('todos/1');
  });

  it('uses correct payload structure for DynamoDB put operation', async () => {
    mockedCreateApi.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: { nested: { value: 'test' } },
      }),
    });

    mockedSend.mockResolvedValue({});

    await handler(baseEvent, context);

    const putCommand = mockedSend.mock.calls[0][0] as PutCommand;
    expect(putCommand.input.Item).toHaveProperty('taskId');
    expect(putCommand.input.Item).toHaveProperty('createdAt');
    expect(putCommand.input.Item).toHaveProperty('data');
  });
});
