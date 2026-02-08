import { defaultMiddlewares } from '../../../src/middlewares/chain';
import { responseMiddleware } from '../../../src/middlewares/response.middlware';

describe('defaultMiddlewares', () => {
  it('exports the correct middlewares array', () => {
    expect(defaultMiddlewares).toEqual([responseMiddleware]);
    expect(defaultMiddlewares.length).toBe(1);
    expect(defaultMiddlewares[0]).toBe(responseMiddleware);
  });
});
