import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export type AsyncAPIGatewayHandler = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<APIGatewayProxyResult>;

export type Middleware = (
  handler: AsyncAPIGatewayHandler
) => AsyncAPIGatewayHandler;