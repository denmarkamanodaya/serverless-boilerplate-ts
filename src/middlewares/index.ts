import { withParsedBody } from './body-parser.middleware';
// import { withAuth } from './authentication.middleware';
import { LambdaHandler } from './types.middleware';

export const Middleware = (handler: LambdaHandler): LambdaHandler => withParsedBody(handler);
