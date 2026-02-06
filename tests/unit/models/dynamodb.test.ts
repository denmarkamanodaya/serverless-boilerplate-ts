import { jest } from '@jest/globals';

describe('ddbDocClient', () => {
  const mockFrom = jest.fn();
  const mockDynamoClient = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Set env BEFORE import
    process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';

    // Mock AWS SDKs
    jest.mock('@aws-sdk/client-dynamodb', () => ({
      DynamoDBClient: mockDynamoClient,
    }));

    jest.mock('@aws-sdk/lib-dynamodb', () => ({
      DynamoDBDocumentClient: {
        from: mockFrom,
      },
    }));
  });

  it('creates DynamoDB client and document client with local config', async () => {
    const fakeClient = { fake: 'ddb-client' };
    const fakeDocClient = { fake: 'doc-client' };

    mockDynamoClient.mockReturnValue(fakeClient);
    mockFrom.mockReturnValue(fakeDocClient);

    const module = await import('../../../src/models/dynamodb'); // <-- adjust path if needed

    expect(mockDynamoClient).toHaveBeenCalledWith({
      region: 'local',
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'LOCAL',
        secretAccessKey: 'LOCAL',
      },
    });

    expect(mockFrom).toHaveBeenCalledWith(fakeClient);
    expect(module.ddbDocClient).toBe(fakeDocClient);
  });
});
