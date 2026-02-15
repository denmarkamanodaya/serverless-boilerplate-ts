import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { CaseRepository } from '../../../models/cases/case.repository';

export const handler = Middleware(async (event) => {
  const { caseId, status } = event.body!;

  await CaseRepository.updateStatus(caseId, status);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
    }),
  };
});
