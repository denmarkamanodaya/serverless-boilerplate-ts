import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ClientRepository } from '../../../models/client/client.repository';

export const handler = Middleware(async (event) => {
  const clients = await ClientRepository.list();

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: clients,
    }),
  };
});
