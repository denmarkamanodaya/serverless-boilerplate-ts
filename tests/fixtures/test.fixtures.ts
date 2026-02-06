import { APIGatewayProxyEvent } from 'aws-lambda';

// export const validTestRequest: APIGatewayProxyEvent = {
//   ...(body = { title: 'TEST TITLE', completed: true }),
// };

export const validResponse = 'Hello from Serverless + TypeScript + Offline!';
export const objectPayload = { foo: 'bar' };
export const validPayload = { title: 'TEST TITLE', completed: true };
export const invalidPayload = '{invalid JSON}';

export const makeEvent = (body: any): APIGatewayProxyEvent => {
  return { ...baseEvent, body: body as any };
};

export const baseEvent: APIGatewayProxyEvent = {
  body: '',
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {} as any,
  resource: '',
};
