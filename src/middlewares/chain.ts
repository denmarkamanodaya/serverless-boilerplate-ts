import { Middleware } from './middleware';
import { responseMiddleware } from './response.middlware';

export const defaultMiddlewares: Middleware[] = [responseMiddleware];
