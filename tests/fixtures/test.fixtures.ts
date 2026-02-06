import { APIGatewayProxyEvent } from 'aws-lambda';

export const validTestRequestFixtures: APIGatewayProxyEvent = {
  body: JSON.stringify({ title: 'TEST TITLE', completed: true }),
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
