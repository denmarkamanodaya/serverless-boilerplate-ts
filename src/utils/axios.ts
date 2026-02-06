// apiFactory.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import httpStatus from 'http-status';
import { ResponseMessage } from '../common/response.interface';

export interface RequestOptions<B = any> {
  url: string;
  method?: Method;
  headers?: Record<string, string>;
  data?: B;
  params?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  statusText: string;
  error?: string;
}

export interface ApiFactoryOptions {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  onRefreshToken?: () => Promise<string>; // optional token refresh callback
}

export function createApi({ baseURL, defaultHeaders, onRefreshToken }: ApiFactoryOptions) {
  const client: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    },
  });

  // Request interceptor
  client.interceptors.request.use(async (config) => {
    // Dynamic token refresh
    if (onRefreshToken) {
      const token = await onRefreshToken();
      if (token) config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Always reject so we handle it in our wrapper
      return Promise.reject(error);
    },
  );

  // Generic request helper
  async function request<T = any, B = any>({
    url,
    method = 'GET',
    headers,
    data,
    params,
  }: RequestOptions<B>): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await client.request<T>({
        url,
        method,
        headers,
        data,
        params,
      });

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (err: any) {
      // Catch all errors and return typed ApiResponse
      const status = err.response?.status || httpStatus.INTERNAL_SERVER_ERROR;
      const statusText = err.response?.statusText || ResponseMessage.INTERNAL_SERVER_ERROR;
      const errorMessage = err.response?.data?.message || err.message || ResponseMessage.INTERNAL_SERVER_ERROR;

      return {
        data: null,
        status,
        statusText,
        error: errorMessage,
      };
    }
  }

  // Shortcut methods
  return {
    request,
    get: <T = any>(url: string, params?: Record<string, any>, headers?: Record<string, string>) =>
      request<T>({ url, method: 'GET', params, headers }),
    post: <T = any, B = any>(url: string, data?: B, headers?: Record<string, string>) =>
      request<T, B>({ url, method: 'POST', data, headers }),
    put: <T = any, B = any>(url: string, data?: B, headers?: Record<string, string>) =>
      request<T, B>({ url, method: 'PUT', data, headers }),
    delete: <T = any>(url: string, params?: Record<string, any>, headers?: Record<string, string>) =>
      request<T>({ url, method: 'DELETE', params, headers }),
    patch: <T = any, B = any>(url: string, data?: B, headers?: Record<string, string>) =>
      request<T, B>({ url, method: 'PATCH', data, headers }),
  };
}
