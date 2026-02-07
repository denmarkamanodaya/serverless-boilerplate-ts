// getParameters.test.ts
import { GetParameters } from '../../../src/utils/parameter-store';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

// Mock AWS SDK v3
jest.mock('@aws-sdk/client-ssm', () => ({
  SSMClient: jest.fn(() => ({
    send: jest.fn(),
  })),
  GetParameterCommand: jest.fn(),
}));

describe('GetParameters', () => {
  const mockSend = jest.fn();

  beforeAll(() => {
    // Mock SSMClient to use our mockSend
    (SSMClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AWS_REGION = 'us-east-1';
    process.env.SSM_PARAMETER_NAME = 'test-param';
  });

  it('returns the parameter value when successful', async () => {
    // Ensure send returns a resolved Promise
    mockSend.mockImplementation(() => Promise.resolve({ Parameter: { Value: 'my-secret-value' } }));

    const result = await GetParameters();

    expect(SSMClient).toHaveBeenCalledWith({ region: 'us-east-1' });
    expect(GetParameterCommand).toHaveBeenCalledWith({
      Name: 'test-param',
      WithDecryption: true,
    });
    expect(result).toBe('my-secret-value');
  });

  it('returns undefined when parameter is missing', async () => {
    mockSend.mockImplementation(() => Promise.resolve({ Parameter: undefined }));

    const result = await GetParameters();

    expect(result).toBeUndefined();
  });

  it('throws an error when client.send fails', async () => {
    const error = new Error('SSM error');
    mockSend.mockImplementation(() => Promise.reject(error));

    await expect(GetParameters()).rejects.toThrow('SSM error');
  });
});
