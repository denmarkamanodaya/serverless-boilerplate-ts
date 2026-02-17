import { AutomationRepository } from '../../../models/automation/automation.repository';
import { Middleware } from '../../../middlewares';
import httpStatus from 'http-status';

export const handler = Middleware(async (event) => {
    const { type, key, value } = event.body;

    if (!type || !key || !value) {
        return {
            statusCode: httpStatus.BAD_REQUEST,
            body: JSON.stringify({ message: 'Missing required parameters: type, key, value' }),
        };
    }

    const result = await AutomationRepository.updateByType(type, key, value);

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: 'Update complete',
            ...result
        }),
    };
});
