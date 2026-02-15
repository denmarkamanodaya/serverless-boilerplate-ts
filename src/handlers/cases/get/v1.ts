import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { CaseRepository } from '../../../models/cases/case.repository';

export const handler = Middleware(async (event) => {
  const { id } = event.queryStringParameters!;

  const caseEntity = await CaseRepository.get(id!);

  if (!caseEntity) {
    return {
      statusCode: httpStatus.NOT_FOUND,
      body: JSON.stringify({
        error: 'Case not found',
      }),
    };
  }

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: caseEntity,
    }),
  };
});
