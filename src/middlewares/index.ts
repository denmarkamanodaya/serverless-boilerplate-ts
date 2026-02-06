import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export type AsyncAPIGatewayHandler = (
  event: APIGatewayProxyEvent & { body: any }, // allow parsed body
  context: Context,
) => Promise<APIGatewayProxyResult>;

export const withMiddleware =
  <
    TEvent extends APIGatewayProxyEvent = APIGatewayProxyEvent,
    TResult extends APIGatewayProxyResult = APIGatewayProxyResult,
  >(
    handler: (event: TEvent & { body: any }, context: Context) => Promise<TResult>,
  ) =>
  async (event: TEvent, context: Context): Promise<TResult> => {
    try {
      // If body is a string, parse it; otherwise, leave it as is
      let parsedBody: any = {};

      if (event.body) {
        if (typeof event.body === 'string') {
          parsedBody = JSON.parse(event.body);
        } else {
          parsedBody = event.body;
        }
      }

      // Pass modified event to handler
      return handler({ ...event, body: parsedBody } as TEvent & { body: any }, context);
    } catch (err) {
      console.error('JSON parsing error', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid JSON body' }),
      } as TResult;
    }
  };
