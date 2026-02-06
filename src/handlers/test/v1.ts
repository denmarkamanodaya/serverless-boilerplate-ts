import httpStatus from 'http-status';
import { withMiddleware, AsyncAPIGatewayHandler } from '../../middlewares/index';

export const handler: AsyncAPIGatewayHandler = withMiddleware(async (event, context) => ({
  statusCode: httpStatus.OK,
  body: JSON.stringify({
    message: 'Hello from Serverless + TypeScript + Offline!',
    input: event.body,
  }),
}));
