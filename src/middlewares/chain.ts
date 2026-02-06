import { Middleware } from '../common/types';
import { jsonBodyMiddleware } from './body-parser.middleware';
import { responseMiddleware } from './response.middlware';

export const defaultMiddlewares: Middleware[] = [jsonBodyMiddleware, responseMiddleware];
