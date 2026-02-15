import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { CaseRepository } from '../../../models/cases/case.repository';
import { HistoryRepository } from '../../../models/history/history.repository';

export const handler = Middleware(async (event) => {
  const { caseId, status } = event.body!;

  await CaseRepository.updateStatus(caseId, status);
  await HistoryRepository.create('STATUS_UPDATE', `Updated status of Case #${caseId.slice(-4).toUpperCase()} to ${status.toUpperCase()}`, caseId);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
