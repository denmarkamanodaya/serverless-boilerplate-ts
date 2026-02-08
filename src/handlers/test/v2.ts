import httpStatus from 'http-status';
import { AsyncAPIGatewayHandler } from '../../common/types';
import { withMiddleware } from '../../middlewares/index';
import { createApi, ApiResponse } from '../../utils/axios';

export const handler: AsyncAPIGatewayHandler = withMiddleware(async (event) => {
  const api = createApi({ baseURL: process.env.TEST_AXIOS_ENDPOINT || '' });
  const response: ApiResponse = await api.get(`todos/1`);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response.data,
    }),
  };
});
