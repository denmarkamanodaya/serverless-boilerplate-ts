import { Middleware } from './types';
import httpStatus from 'http-status';

export const jsonBodyMiddleware: Middleware = (handler) => {
  return async (event, context) => {
    if (event.body && typeof event.body === 'string') {
      try {
        event.body = JSON.parse(event.body);
        console.log(`BEFORE: ${JSON.stringify(event.body)}`);
      } catch {
        return {
          statusCode: httpStatus.BAD_REQUEST,
          body: JSON.stringify({ message: 'Invalid JSON body' }),
        };
      }
    }

    return handler(event, context);
  };
};