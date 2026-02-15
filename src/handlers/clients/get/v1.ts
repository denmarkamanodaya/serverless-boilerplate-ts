import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { ClientRepository } from '../../../models/client/client.repository';

export const handler = Middleware(async (event) => {
  const { id } = event.queryStringParameters!;

  const client = await ClientRepository.get(id!);

  if (!client) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      body: JSON.stringify({
        message: 'Client not found',
      }),
    };
  }

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: client,
    }),
  };
});
