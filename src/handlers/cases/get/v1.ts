import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';

export const handler = Middleware(async (event) => {
  const { id } = event.queryStringParameters!;

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: {},
    }),
  };
});
