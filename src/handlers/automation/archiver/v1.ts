import { AutomationRepository } from '../../../models/automation/automation.repository';
import { Middleware } from '../../../middlewares';
import httpStatus from 'http-status';

export const handler = Middleware(async (event) => {
    const { type, age } = event.body;

    if (!type || age === undefined) {
        return {
            statusCode: httpStatus.BAD_REQUEST,
            body: JSON.stringify({ message: 'Missing required parameters: type, age' }),
        };
    }

    const result = await AutomationRepository.archiveByAge(type, parseInt(age));

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: 'Archive complete',
            ...result
        }),
    };
});
