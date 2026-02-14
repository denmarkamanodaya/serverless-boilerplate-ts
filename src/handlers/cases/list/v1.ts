import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { getFilteredItems } from '../../../models/dynamodb';

export const handler = Middleware(async (event) => {
  const { status } = event.queryStringParameters || {};

  // DynamoDB Operation
  const response = await getFilteredItems(
    process.env.DYNAMODB_CASES_TABLE_NAME!,
    '#status = :status',
    {
      '#status': 'status',
    },
    {
      ':status': status || process.env.CASE_STATUS_ACTIVE!,
    },
  );

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response?.Items ? JSON.parse(JSON.stringify(response.Items)) : [],
    }),
  };
});
