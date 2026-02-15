import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { CaseRepository } from '../../../models/cases/case.repository';

export const handler = Middleware(async (event) => {
  const { status } = event.queryStringParameters || {};

  const cases = await CaseRepository.list(status);

  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      data: cases,
    }),
  };
});
