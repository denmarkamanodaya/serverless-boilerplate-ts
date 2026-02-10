import httpStatus from 'http-status';
import { Middleware } from '../../middlewares/index';
import axios from 'axios';

export const handler = Middleware(async (event) => {
  const response = await axios.get(`${process.env.TEST_AXIOS_ENDPOINT}/todos/1`);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response.data,
    }),
  };
});
