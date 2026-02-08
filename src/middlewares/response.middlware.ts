import { Middleware } from './middleware';
import { APIGatewayProxyResult } from 'aws-lambda';
import httpStatus from 'http-status';
import { ResponseMessage } from '../common/response.interface';

export const responseMiddleware: Middleware = (handler) => {
  return async (event, context) => {
    try {
      const result = await handler(event, context);

      const response: APIGatewayProxyResult = {
        statusCode: result.statusCode ?? httpStatus.OK,
        headers: {
          'Content-Type': 'application/json',
          ...result.headers,
        },
        body: typeof result.body === 'string' ? result.body : JSON.stringify(result.body),
        isBase64Encoded: result.isBase64Encoded ?? false,
      };

      console.log(`AFTER: ${JSON.stringify(response)}`);

      return response;
    } catch (err: any) {
      console.error('Unhandled error:', err);

      return {
        statusCode: err.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: err.message ?? ResponseMessage.INTERNAL_SERVER_ERROR,
        }),
      };
    }
  };
};
