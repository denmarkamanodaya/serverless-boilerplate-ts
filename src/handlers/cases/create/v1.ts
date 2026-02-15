import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { v4 } from 'uuid';
import { CaseFactory } from '../../../models/cases/case.factory';
import { CaseRepository } from '../../../models/cases/case.repository';

export const handler = Middleware(async (event) => {
  const { data, status, caseId } = event.body;

  // Use provided caseId (for edits) or generate new one
  const finalCaseId = caseId || v4();
  const finalStatus = status || process.env.CASE_STATUS || 'quotation';

  const caseEntity = CaseFactory.create({
    caseId: finalCaseId,
    status: finalStatus,
    data,
  });

  await CaseRepository.save(caseEntity);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: ResponseMessage.SUCCESS,
      caseId: finalCaseId,
    }),
  };
});
