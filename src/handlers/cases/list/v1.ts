import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';

export const handler = Middleware(async (event) => {
  const { status } = event.queryStringParameters || {};

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: [],
    }),
  };
});
