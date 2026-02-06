import { handler } from '../../../../src/handlers/test/v1';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import httpStatus from 'http-status';
import { validTestRequestFixtures } from '../../../fixtures/test.fixtures';

describe('Lambda handler', () => {
  const context: Context = {} as Context;

  it('should return OK with parsed body', async () => {
    const result = await handler(validTestRequestFixtures, context);

    expect(result.statusCode).toBe(httpStatus.OK);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Hello from Serverless + TypeScript + Offline!',
      input: { title: 'TEST TITLE', completed: true }, // <- parsed body
    });
  });
});
