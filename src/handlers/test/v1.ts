import httpStatus from 'http-status';
import { Middleware } from '../../middlewares/index';

export const handler = Middleware(async (event, context) => ({
  statusCode: httpStatus.OK,
  body: JSON.stringify({
    message: 'Hello from Serverless + TypeScript + Offline!',
    input: event.body,
  }),
}));
