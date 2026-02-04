import httpStatus from "http-status";
import { AsyncAPIGatewayHandler } from '../../middlewares/types';
import { withMiddleware } from '../../middlewares/index';
import { createApi, ApiResponse } from '../../utils/axios';
import { TestInterface } from '../../common/test.interface';

export const handler: AsyncAPIGatewayHandler = withMiddleware (async (event) => {
  const api = createApi({ baseURL: process.env.TEST_AXIOS_URL || '' });
  const response: ApiResponse<TestInterface> = await api.get(`todos/1`);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response.data
    }),
  };
});