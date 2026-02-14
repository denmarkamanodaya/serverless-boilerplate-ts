import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { getAll } from '../../../models/dynamodb';

export const handler = Middleware(async (event) => {
  // DynamoDB Operation
  const response = await getAll(process.env.DYNAMODB_CLIENTS_TABLE_NAME!);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response?.Items ? JSON.parse(JSON.stringify(response.Items)) : [],
    }),
  };
});
