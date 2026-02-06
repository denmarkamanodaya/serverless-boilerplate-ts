// tests/handlers/handler.test.ts
import httpStatus from 'http-status';
import { handler } from '../../../../src/handlers/test/v2';
import { createApi } from '../../../../src/utils/axios';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { makeEvent, validPayload } from '../../../fixtures/test.fixtures';

jest.mock('../../../../src/utils/axios', () => ({
  createApi: jest.fn(),
}));

const mockedCreateApi = createApi as jest.Mock;

const context: Context = {} as Context;

describe('handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TEST_AXIOS_ENDPOINT = 'https://example.com';
  });

  it('should call axios and return API data', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        title: 'Test Todo',
        completed: false,
      },
    });

    mockedCreateApi.mockReturnValue({
      get: mockGet,
    });

    const result = await handler(makeEvent(JSON.stringify(validPayload)), context);

    expect(createApi).toHaveBeenCalledWith({
      baseURL: 'https://example.com',
    });
    expect(mockGet).toHaveBeenCalledWith('todos/1');

    // 🔹 lambda response assertions
    expect(result.statusCode).toBe(httpStatus.OK);

    const body = JSON.parse(result.body);
    expect(body.data).toEqual({
      id: 1,
      title: 'Test Todo',
      completed: false,
    });
  });

  it('should fall back to empty baseURL when TEST_AXIOS_ENDPOINT is undefined', async () => {
    // 🔹 force OR branch
    delete process.env.TEST_AXIOS_ENDPOINT;

    const mockGet = jest.fn().mockResolvedValue({
      data: { id: 1 },
    });

    mockedCreateApi.mockReturnValue({
      get: mockGet,
    });

    const result = await handler(makeEvent(JSON.stringify(validPayload)), context);

    // 🔹 assert OR path
    expect(createApi).toHaveBeenCalledWith({
      baseURL: '',
    });

    expect(result.statusCode).toBe(httpStatus.OK);
  });
});
