import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import * as Joi from 'joi';
import { Middleware } from '../../../middlewares/index';
import { ResponseMessage } from '../../../common/response.enum';
import { UserRepository, UserRole, UserStatus } from '../../../models/users';

const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailAddress: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(...Object.values(UserRole)).required(),
  avatarUrl: Joi.string().uri().allow(null, '').optional(),
  status: Joi.string().valid(...Object.values(UserStatus)).default(UserStatus.ACTIVE),
  metadata: Joi.string().optional(),
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

  const existingUser = await UserRepository.findByEmail(value.emailAddress);

  if (existingUser) {
    return {
      statusCode: httpStatus.CONFLICT,
      body: JSON.stringify({
        message: 'User with this email already exists',
      }),
    };
  }

  const saltRounds = Number(process.env.HASH_SALT_ROUNDS) || 10;
  const passwordHash = await bcrypt.hash(value.password, saltRounds);

  const newUser = {
    PK: `USER#${value.emailAddress}`,
    SK: 'META',
    firstName: value.firstName,
    lastName: value.lastName,
    emailAddress: value.emailAddress,
    passwordHash,
    role: value.role,
    status: value.status || UserStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    avatarUrl: value.avatarUrl,
    metadata: value.metadata,
    type: 'USER' as const,
  };

  await UserRepository.save(newUser);

  return {
    statusCode: httpStatus.CREATED,
    body: JSON.stringify({
      message: ResponseMessage.SUCCESS,
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        emailAddress: newUser.emailAddress,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
    }),
  };
});
