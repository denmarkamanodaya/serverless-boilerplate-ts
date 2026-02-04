import httpStatus from "http-status";
import { AsyncAPIGatewayHandler } from '../../middlewares/types';
import { withMiddleware } from '../../middlewares/index';
// import { ResponseInterface } from "../../utils/response-interface";

export const handler: AsyncAPIGatewayHandler = withMiddleware (async (event) => {
  return {
    statusCode: httpStatus.OK,
    body: JSON.stringify({
      message: "Hello from Serverless + TypeScript + Offline!",
      input: event.body,
    }),
  };
});