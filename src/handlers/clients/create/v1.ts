import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { v4 } from 'uuid';
import { ClientService } from '../../../utils/client-service';

export const handler = Middleware(async (event) => {
  const { clientName, businessAddress, taxId, businessName } = event.body;

  const payload = {
    clientId: v4(),
    clientName: clientName,
    businessName: businessName,
    businessAddress: businessAddress,
    taxId: taxId,
  };

  // DynamoDB Operation
  await ClientService.createClient(payload);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
