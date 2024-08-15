import request from 'supertest';

import { JhhServerApp } from './jhh-server-app';

import { ApiRoute } from '@jhh/shared/domain';

describe('JhhServerApp', () => {
  let app;

  beforeEach(() => {
    app = JhhServerApp();
  });

  it('should work', () => {
    expect(typeof app.listen).toBe('function');
  });

  it('should enable CORS', async () => {
    const res = await request(app).get(`${ApiRoute.BaseUser}/some-route`);
    expect(res.headers['access-control-allow-origin']).toEqual('*');
  });

  if (process.env.NODE_ENV !== 'development') {
    it('should include security headers', async () => {
      const response = await request(app).get(
        `${ApiRoute.BaseUser}/some-route`
      );
      expect(response.headers['content-security-policy']).toBeDefined();
    });
  }

  it('should require authentication', async () => {
    const response = await request(app).get(
      `${ApiRoute.BaseProtected}/protected-route`
    );
    expect(response.statusCode).toBe(401);
  });
});
