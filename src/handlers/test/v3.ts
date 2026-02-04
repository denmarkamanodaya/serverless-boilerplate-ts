import httpStatus from "http-status";
import { AsyncAPIGatewayHandler } from '../../middlewares/types';
import { withMiddleware } from '../../middlewares/index';
import { createApi, ApiResponse } from '../../utils/axios';
import { TestInterface } from '../../common/test.interface';
import { ddbDocClient } from "../../models/dynamodb";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export const handler: AsyncAPIGatewayHandler = withMiddleware (async (event) => {
  // Axios Operation
  const api = createApi({ baseURL: process.env.TEST_AXIOS_ENDPOINT || '' });
  const response: ApiResponse<TestInterface> = await api.get(`todos/1`);
    
  // Gated error
  if (!response.data) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      body: JSON.stringify({ error: 'No data received' }),
    };
  }

  const { userId, id, title, completed } = response.data;

  // DynamoDB Operation
  await ddbDocClient.send(new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: { userId, id, title, completed },
  }));


  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: response.data
    }),
  };
});