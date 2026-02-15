import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { v4 } from 'uuid';

export const handler = Middleware(async (event) => {
  const { data } = event.body;

  const payload = {
    caseId: v4(),
    data,
    status: process.env.CASE_STATUS,
    createdAt: new Date().toISOString(),
  };

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
