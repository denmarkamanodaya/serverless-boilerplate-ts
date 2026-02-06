import axios from 'axios';
import { createApi } from '../../../src/utils/axios';

jest.mock('axios');

describe('createApi', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      request: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates axios client with base config', () => {
    createApi({ baseURL: 'https://api.test.com' });

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.test.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('adds Authorization header when onRefreshToken returns token', async () => {
    const onRefreshToken = jest.fn().mockResolvedValue('token123');

    createApi({ baseURL: '', onRefreshToken });

    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];

    const config = {
      headers: { set: jest.fn() },
      method: 'get',
      url: '/test',
    };

    await requestInterceptor(config);

    expect(onRefreshToken).toHaveBeenCalled();
    expect(config.headers.set).toHaveBeenCalledWith('Authorization', 'Bearer token123');
  });

  it('does not set Authorization header when token is empty', async () => {
    const onRefreshToken = jest.fn().mockResolvedValue('');

    createApi({ baseURL: '', onRefreshToken });

    const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];

    const config = {
      headers: { set: jest.fn() },
      method: 'get',
      url: '/test',
    };

    await requestInterceptor(config);

    expect(config.headers.set).not.toHaveBeenCalled();
  });

  it('passes through response interceptor success', () => {
    createApi({ baseURL: '' });

    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];

    const response = { data: 'ok' };
    expect(responseInterceptor(response)).toBe(response);
  });

  it('rejects response interceptor error', async () => {
    createApi({ baseURL: '' });

    const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

    await expect(errorInterceptor(new Error('fail'))).rejects.toThrow('fail');
  });

  it('handles successful request', async () => {
    mockAxiosInstance.request.mockResolvedValue({
      data: { id: 1 },
      status: 200,
      statusText: 'OK',
    });

    const api = createApi({ baseURL: '' });

    const result = await api.request({ url: '/ok' });

    expect(result).toEqual({
      data: { id: 1 },
      status: 200,
      statusText: 'OK',
    });
  });

  it('handles error with response object', async () => {
    mockAxiosInstance.request.mockRejectedValue({
      response: {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Invalid token' },
      },
    });

    const api = createApi({ baseURL: '' });

    const result = await api.request({ url: '/fail' });

    expect(result).toEqual({
      data: null,
      status: 401,
      statusText: 'Unauthorized',
      error: 'Invalid token',
    });
  });

  it('handles error without response object', async () => {
    mockAxiosInstance.request.mockRejectedValue(new Error('Network error'));

    const api = createApi({ baseURL: '' });

    const result = await api.request({ url: '/fail' });

    expect(result).toEqual({
      data: null,
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Network error',
    });
  });

  it('covers shortcut methods', async () => {
    mockAxiosInstance.request.mockResolvedValue({
      data: {},
      status: 200,
      statusText: 'OK',
    });

    const api = createApi({ baseURL: '' });

    await api.get('/get');
    await api.post('/post', { a: 1 });
    await api.put('/put', { a: 1 });
    await api.delete('/delete');
    await api.patch('/patch', { a: 1 });

    expect(mockAxiosInstance.request).toHaveBeenCalledTimes(5);
  });

  it('falls back to "Unknown Error" when error has no response and no message', async () => {
    mockAxiosInstance.request.mockRejectedValue({}); // 👈 key line

    const api = createApi({ baseURL: '' });

    const result = await api.request({ url: '/fail' });

    expect(result).toEqual({
      data: null,
      status: 500,
      statusText: 'Internal Server Error',
      error: 'Unknown Error',
    });
  });
});
