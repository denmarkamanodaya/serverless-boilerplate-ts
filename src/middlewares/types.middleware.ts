import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export type LambdaHandler = (
  event: APIGatewayProxyEvent & { body: any },
  context: Context,
) => Promise<APIGatewayProxyResult>;
