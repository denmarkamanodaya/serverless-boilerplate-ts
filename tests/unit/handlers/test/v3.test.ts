import httpStatus from 'http-status';
import { handler } from '../../../../src/handlers/test/v3';
import { ResponseMessage } from '../../../../src/common/response.enum';
import * as dynamodb from '../../../../src/models/dynamodb';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../../../src/models/dynamodb');
jest.mock('uuid', () => ({ v4: () => 'test-uuid-123' }));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockPutItem = dynamodb.putItem as jest.MockedFunction<typeof dynamodb.putItem>;

describe('v3 handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TEST_AXIOS_ENDPOINT = 'https://api.example.com';
  });

  it('should return success when data is received and stored', async () => {
    const mockData = { id: 1, title: 'Test Todo', completed: false };
    mockAxios.get.mockResolvedValue({ data: mockData });
    mockPutItem.mockResolvedValue(undefined);

    const event = { body: { title: 'Test Task', completed: false } };
    const result = await handler(event as any);

    expect(result.statusCode).toBe(httpStatus.OK);
    expect(JSON.parse(result.body).data).toBe(ResponseMessage.SUCCESS);
    expect(mockPutItem).toHaveBeenCalled();
  });

  it('should return BAD_REQUEST when axios response has no data', async () => {
    mockAxios.get.mockResolvedValue({ data: null });

    const event = { body: { title: 'Test Task', completed: false } };
    const result = await handler(event as any);

    expect(result.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body).error).toBe('No data received');
    expect(mockPutItem).not.toHaveBeenCalled();
  });

  it('should call axios with correct endpoint', async () => {
    mockAxios.get.mockResolvedValue({ data: { id: 1 } });
    mockPutItem.mockResolvedValue(undefined);

    const event = { body: { title: 'Test', completed: true } };
    await handler(event as any);

    expect(mockAxios.get).toHaveBeenCalledWith('https://api.example.com/todos/1');
  });

  it('should store payload with correct structure', async () => {
    mockAxios.get.mockResolvedValue({ data: { id: 1 } });
    mockPutItem.mockResolvedValue(undefined);

    const event = { body: { title: 'My Task', completed: true } };
    await handler(event as any);

    expect(mockPutItem).toHaveBeenCalledWith(
      expect.objectContaining({
        taskId: { S: 'test-uuid-123' },
        title: { S: 'My Task' },
        completed: { BOOL: true },
      }),
    );
  });
});
