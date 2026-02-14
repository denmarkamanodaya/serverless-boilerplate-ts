import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { putItem } from '../../../models/dynamodb';
import { v4 } from 'uuid';

export const handler = Middleware(async (event) => {
  const { data } = event.body;

  const payload = {
    caseId: v4(),
    data,
    createdAt: new Date().toISOString(),
  };

  await putItem(process.env.DYNAMODB_CASES_TABLE_NAME!, payload);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
