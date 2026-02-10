import { handler } from '../../../../src/handlers/test/v2';
import axios from 'axios';
import httpStatus from 'http-status';

jest.mock('axios');
jest.mock('../../../../src/middlewares/index.ts', () => ({
  Middleware: (fn: Function) => fn,
}));

describe('v2 handler', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TEST_AXIOS_ENDPOINT = 'https://jsonplaceholder.typicode.com';
  });

  it('should return successful response with todo data', async () => {
    const mockTodoData = { id: 1, title: 'Test Todo', completed: false };
    mockAxios.get.mockResolvedValue({ data: mockTodoData });

    const result = await handler({} as any);

    expect(mockAxios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1');
    expect(result.statusCode).toBe(httpStatus.OK);
    expect(JSON.parse(result.body)).toEqual({ data: mockTodoData });
  });

  it('should handle axios errors', async () => {
    const error = new Error('Network error');
    mockAxios.get.mockRejectedValue(error);

    await expect(handler({} as any)).rejects.toThrow('Network error');
  });

  it('should use TEST_AXIOS_ENDPOINT environment variable', async () => {
    process.env.TEST_AXIOS_ENDPOINT = 'https://custom-endpoint.com';
    mockAxios.get.mockResolvedValue({ data: {} });

    await handler({} as any);

    expect(mockAxios.get).toHaveBeenCalledWith('https://custom-endpoint.com/todos/1');
  });
});
