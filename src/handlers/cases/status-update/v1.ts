import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { updateItem } from '../../../models/dynamodb';
import { ResponseMessage } from '../../../common/response.enum';

export const handler = Middleware(async (event) => {
  const { caseId, status } = event.body!;

  // DynamoDB Operation
  const response = await updateItem(
    process.env.DYNAMODB_CASES_TABLE_NAME!,
    'caseId',
    caseId,
    'SET #status = :status',
    { '#status': 'status' },
    {
      ':status': status,
    },
  );

  console.log(response);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
