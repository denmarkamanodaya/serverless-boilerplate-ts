import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { getItem } from '../../../models/dynamodb';

export const handler = Middleware(async (event) => {
  const { id } = event.queryStringParameters!;

  // DynamoDB Operation
  const response = await getItem(process.env.DYNAMODB_CLIENTS_TABLE_NAME!, 'clientId', id!);

  console.log(response.Item);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response?.Item ? JSON.parse(JSON.stringify(response.Item)) : {},
    }),
  };
});
