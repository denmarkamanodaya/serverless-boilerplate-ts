import { AsyncAPIGatewayHandler, Middleware } from '../common/types';
import { defaultMiddlewares } from './chain';

export const withMiddleware = (handler: AsyncAPIGatewayHandler, extra: Middleware[] = []): AsyncAPIGatewayHandler => {
  const chain = [...defaultMiddlewares, ...extra];
  return chain.reduceRight((next, middleware) => middleware(next), handler);
};
