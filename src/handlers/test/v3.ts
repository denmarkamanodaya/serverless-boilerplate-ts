import httpStatus from 'http-status';
import { Middleware } from '../../middlewares/index';
import { ResponseMessage } from '../../common/response.enum';
import { v4 as uuid } from 'uuid';
import { putItem } from '../../models/dynamodb';
import axios from 'axios';

export const handler = Middleware(async (event) => {
  const { title, completed } = event.body;

  const response = await axios.get(`${process.env.TEST_AXIOS_ENDPOINT}/todos/1`);

  // Gated error
  if (!response.data) {
    return {
      statusCode: httpStatus.BAD_REQUEST,
      body: JSON.stringify({ error: 'No data received' }),
    };
  }

  const payload = {
    taskId: { S: uuid() },
    title: { S: title },
    completed: { BOOL: completed },
    createdAt: { S: new Date().toISOString() },
    data: { S: JSON.stringify(response.data) },
  };

  // DynamoDB Operation
  await putItem(payload);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
