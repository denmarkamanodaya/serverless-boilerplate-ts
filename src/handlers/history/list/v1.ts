import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { HistoryRepository } from '../../../models/history/history.repository';

export const handler = Middleware(async (event) => {
    const logs = await HistoryRepository.list();

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: ResponseMessage.SUCCESS,
            data: logs,
        }),
    };
});
