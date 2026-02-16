import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { HistoryRepository } from '../../../models/history/history.repository';

export const handler = Middleware(async (event) => {
    const { caseId } = event.pathParameters || {};

    if (!caseId) {
        return {
            statusCode: httpStatus.BAD_REQUEST,
            body: JSON.stringify({
                message: "Case ID is required",
            }),
        };
    }

    const logs = await HistoryRepository.listByCaseId(caseId, 100); // Fetch up to 100 events

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: ResponseMessage.SUCCESS,
            data: logs,
        }),
    };
});
