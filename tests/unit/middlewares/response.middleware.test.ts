import httpStatus from 'http-status';
import { responseMiddleware } from '../../../src/middlewares/response.middlware';
import { ResponseMessage } from '../../../src/common/response.interface';

describe('responseMiddleware', () => {
  const event = {} as any;
  const context = {} as any;

  it('wraps handler result with defaults and string body', async () => {
    const handler = jest.fn().mockResolvedValue({
      statusCode: 201,
      body: 'OK',
      headers: { 'X-Test': 'yes' },
      isBase64Encoded: true,
    });

    const middleware = responseMiddleware(handler);
    const result = await middleware(event, context);

    expect(result).toEqual({
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Test': 'yes',
      },
      body: 'OK',
      isBase64Encoded: true,
    });
  });

  it('defaults statusCode and isBase64Encoded and stringifies object body', async () => {
    const handler = jest.fn().mockResolvedValue({
      body: { success: true },
    });

    const middleware = responseMiddleware(handler);
    const result = await middleware(event, context);

    expect(result).toEqual({
      statusCode: httpStatus.OK,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true }),
      isBase64Encoded: false,
    });
  });

  it('handles thrown error with statusCode and message', async () => {
    const error = {
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Bad request',
    };

    const handler = jest.fn().mockRejectedValue(error);
    const middleware = responseMiddleware(handler);

    const result = await middleware(event, context);

    expect(result).toEqual({
      statusCode: httpStatus.BAD_REQUEST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: 'Bad request',
      }),
    });
  });

  it('defaults error statusCode and message when missing', async () => {
    const handler = jest.fn().mockRejectedValue({});
    const middleware = responseMiddleware(handler);

    const result = await middleware(event, context);

    expect(result).toEqual({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: ResponseMessage.INTERNAL_SERVER_ERROR,
      }),
    });
  });
});
