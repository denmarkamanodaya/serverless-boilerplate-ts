import { handler } from '../../../../src/handlers/test/v1';
import { Context } from 'aws-lambda';
import httpStatus from 'http-status';
import { makeEvent, validPayload, objectPayload, invalidPayload, validResponse } from '../../../fixtures/test.fixtures';

describe('Lambda handler', () => {
  const context: Context = {} as Context;

  it('should return OK with parsed body', async () => {
    const request = makeEvent(JSON.stringify(validPayload));
    const result = await handler(request, context);

    expect(result.statusCode).toBe(httpStatus.OK);
    expect(JSON.parse(result.body)).toEqual({
      input: validPayload,
      message: validResponse,
    });
  });

  it('should pass body as-is if body is already an object', async () => {
    const request = makeEvent(objectPayload);
    const result = await handler(request, context);

    expect(result.statusCode).toBe(httpStatus.OK);
    expect(JSON.parse(result.body)).toEqual({
      input: objectPayload,
      message: validResponse,
    });
  });

  it('should handle catch block', async () => {
    const request = makeEvent(invalidPayload);
    const result = await handler(request, context);

    expect(result.statusCode).toBe(httpStatus.BAD_REQUEST);
    expect(JSON.parse(result.body)).toEqual({ message: 'Invalid JSON body' });
  });
});
