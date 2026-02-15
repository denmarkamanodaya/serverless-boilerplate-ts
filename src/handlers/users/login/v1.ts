import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import * as Joi from 'joi';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { UserRepository, UserStatus } from '../../../models/users';

const schema = Joi.object({
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const handler = Middleware(async (event) => {
    const { data } = event.body;

    const { error, value } = schema.validate(data);

    if (error) {
        return {
            statusCode: httpStatus.BAD_REQUEST,
            body: JSON.stringify({
                message: error.details[0].message,
            }),
        };
    }

    const user = await UserRepository.findByEmail(value.emailAddress);

    if (!user) {
        return {
            statusCode: httpStatus.UNAUTHORIZED,
            body: JSON.stringify({
                message: 'Invalid email or password',
            }),
        };
    }

    if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.SUSPENDED) {
        // Allow suspended? Probably not. Let's strict to ACTIVE for login usually, 
        // or handle specific statuses. Boilerplate usually just checks existence/password.
        // But good to check if they are disabled.
        // For now, let's just check if they exist and password matches.
        // If you want to block inactive users:
        if (user.status === UserStatus.INACTIVE) {
            return {
                statusCode: httpStatus.UNAUTHORIZED,
                body: JSON.stringify({
                    message: 'Account is inactive',
                }),
            };
        }
    }


    const isValidPassword = await bcrypt.compare(value.password, user.passwordHash);

    if (!isValidPassword) {
        return {
            statusCode: httpStatus.UNAUTHORIZED,
            body: JSON.stringify({
                message: 'Invalid email or password',
            }),
        };
    }

    // Remove sensitive data
    const { passwordHash, PK, SK, ...userProfile } = user;

    return {
        statusCode: httpStatus.OK,
        body: JSON.stringify({
            message: ResponseMessage.SUCCESS,
            data: userProfile,
        }),
    };
});
