import request from 'supertest';
import express, { Express } from 'express';

import { JhhServerRouterApi } from './jhh-server-router-api';

import { ApiRoute } from '@jhh/shared/domain';

describe('JhhServerRouterApi', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(JhhServerRouterApi());
  });

  it('should respond with "Hello World!" on GET /test', async () => {
    const res = await request(app).get(ApiRoute.Test);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  });
});
