
import httpStatus from 'http-status';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { UserRepository } from '../../../models/users';

export const handler = Middleware(async () => {
    const users = await UserRepository.list();

    // Map to sanitize output (remove password hashes if they were returned, though repo returns entity)
    const sanitizedUsers = users.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        avatarUrl: user.avatarUrl,
        metadata: user.metadata
    }));

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: ResponseMessage.SUCCESS,
            data: sanitizedUsers,
        }),
    };
});
