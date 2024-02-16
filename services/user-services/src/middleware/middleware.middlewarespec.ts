import { Middleware } from './auth.middleware';

describe('MiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new Middleware()).toBeDefined();
  });
});
