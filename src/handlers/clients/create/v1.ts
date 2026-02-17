import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { v4 } from 'uuid';
import { ClientService } from '../../../utils/client-service';
import { HistoryRepository } from '../../../models/history/history.repository';

export const handler = Middleware(async (event) => {
  const { clientName, businessAddress, taxId, businessName, metadata } = event.body;

  const payload = {
    clientId: v4(),
    clientName: clientName,
    businessName: businessName,
    businessAddress: businessAddress,
    taxId: taxId,
    metadata: metadata
  };

  // DynamoDB Operation
  await ClientService.createClient(payload);
  await HistoryRepository.create('CLIENT_CREATED', `Created new client: ${clientName || businessName}`, payload.clientId);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
