import httpStatus from 'http-status';
import { jsonBodyMiddleware } from '../../../src/middlewares/body-parser.middleware';

describe('jsonBodyMiddleware', () => {
  const context = {};

  it('sets empty object when event.body is undefined', async () => {
    const handler = jest.fn().mockResolvedValue('OK');
    const middleware = jsonBodyMiddleware(handler);

    const result = await middleware({ body: undefined }, context);

    expect(handler).toHaveBeenCalledWith({ body: {} }, context);
    expect(result).toBe('OK');
  });

  it('parses JSON string body', async () => {
    const handler = jest.fn().mockResolvedValue('OK');
    const middleware = jsonBodyMiddleware(handler);

    const event = {
      body: JSON.stringify({ title: 'test', completed: false }),
    };

    const result = await middleware(event, context);

    expect(handler).toHaveBeenCalledWith(
      {
        ...event,
        body: { title: 'test', completed: false },
      },
      context,
    );
    expect(result).toBe('OK');
  });

  it('passes through object body unchanged', async () => {
    const handler = jest.fn().mockResolvedValue('OK');
    const middleware = jsonBodyMiddleware(handler);

    const event = {
      body: { title: 'already object' },
    };

    const result = await middleware(event, context);

    expect(handler).toHaveBeenCalledWith(
      {
        ...event,
        body: { title: 'already object' },
      },
      context,
    );
    expect(result).toBe('OK');
  });

  it('returns BAD_REQUEST when JSON parsing fails', async () => {
    const handler = jest.fn();
    const middleware = jsonBodyMiddleware(handler);

    const event = {
      body: '{ invalid json',
    };

    const result = await middleware(event, context);

    expect(handler).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: httpStatus.BAD_REQUEST,
      body: JSON.stringify({ message: 'Invalid JSON body' }),
    });
  });
});
