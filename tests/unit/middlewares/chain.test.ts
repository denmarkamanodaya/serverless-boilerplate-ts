import { defaultMiddlewares } from '../../../src/middlewares/chain';
import { jsonBodyMiddleware } from '../../../src/middlewares/body-parser.middleware';
import { responseMiddleware } from '../../../src/middlewares/response.middlware';

describe('defaultMiddlewares', () => {
  it('exports the correct middlewares array', () => {
    expect(defaultMiddlewares).toEqual([jsonBodyMiddleware, responseMiddleware]);
    expect(defaultMiddlewares.length).toBe(2);
    expect(defaultMiddlewares[0]).toBe(jsonBodyMiddleware);
    expect(defaultMiddlewares[1]).toBe(responseMiddleware);
  });
});
