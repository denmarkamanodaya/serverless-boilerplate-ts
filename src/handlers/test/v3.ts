import httpStatus from 'http-status';
import { AsyncAPIGatewayHandler } from '../../common/types';
import { withMiddleware } from '../../middlewares/index';
import { RequestBody } from '../../common/request.interface';
import { AxiosResponseMessage } from '../../common/response.interface';
import { v4 as uuid } from 'uuid';
import { ddbDocClient } from '../../models/dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { createApi, ApiResponse } from '../../utils/axios';
import { TestInterface } from '../../common/test.interface';

export const handler: AsyncAPIGatewayHandler = withMiddleware(async (event) => {
  const { title, completed } = event.body as unknown as RequestBody;

  const api = createApi({ baseURL: process.env.TEST_AXIOS_ENDPOINT || '' });
  const response: ApiResponse<TestInterface> = await api.get(`todos/1`);

  // Gated error
  if (!response.data) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      body: JSON.stringify({ error: 'No data received' }),
    };
  }

  const payload = {
    taskId: uuid(),
    title,
    completed,
    createdAt: new Date().toISOString(),
    data: response.data,
  };

  // DynamoDB Operation
  await ddbDocClient.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: payload,
    }),
  );

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: AxiosResponseMessage.SUCCESS,
    }),
  };
});
