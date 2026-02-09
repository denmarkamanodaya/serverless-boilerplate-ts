import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import HttpStatus from 'http-status';
import { ResponseMessage } from '../common/response.interface';

export const Middleware =
  (handler: (event: APIGatewayProxyEvent & { body: any }, context: Context) => Promise<APIGatewayProxyResult>) =>
  async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
      let parsedBody: any = {};

      if (event.body) {
        if (typeof event.body === 'string') {
          parsedBody = JSON.parse(event.body);
        } else {
          parsedBody = event.body;
        }
      }

      return handler({ ...event, body: parsedBody } as APIGatewayProxyEvent & { body: any }, context);
    } catch (err) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        body: JSON.stringify({ message: ResponseMessage.INVALID_JSON_BODY }),
      } as APIGatewayProxyResult;
    }
  };
