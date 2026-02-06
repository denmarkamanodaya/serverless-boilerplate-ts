import httpStatus from 'http-status';
import { RequestBody } from '../common/request.interface';

export const jsonBodyMiddleware = (handler: (event: any, context: any) => Promise<any>) => {
  return async (event: any, context: any) => {
    try {
      // Parse event.body to an object if it's a string, or set to empty object if undefined
      let parsedBody: any;

      if (!event.body) {
        parsedBody = {};
      } else if (typeof event.body === 'string') {
        parsedBody = JSON.parse(event.body);
      } else {
        parsedBody = event.body;
      }

      // Optional: type cast for TS
      parsedBody = parsedBody as unknown as RequestBody;

      // Pass the parsed body to the handler
      return handler({ ...event, body: parsedBody }, context);
    } catch (error) {
      console.error('Invalid JSON body', error);
      return {
        statusCode: httpStatus.BAD_REQUEST,
        body: JSON.stringify({ message: 'Invalid JSON body' }),
      };
    }
  };
};
