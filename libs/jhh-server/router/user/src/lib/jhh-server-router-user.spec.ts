import request from 'supertest';
import express, { Express, Router } from 'express';

import { ApiRoute, HttpStatusCode } from '@jhh/shared/domain';

import { JhhServerRouterUser } from './jhh-server-router-user';

jest.mock('@jhh/jhh-server/controller/user', () => {
  return {
    JhhServerControllerUser: jest.fn().mockReturnValue({
      login: jest.fn((req, res) => res.status(200).send('Login successful')),
      register: jest.fn((req, res) =>
        res.status(HttpStatusCode.OK).send('Registration successful')
      ),
      removeAccount: jest.fn((req, res) =>
        res.status(HttpStatusCode.OK).send('Remove account successful')
      ),
    }),
  };
});

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ id: 'user123' }),
}));

describe('JhhServerRouterUser', () => {
  let router: Router;

  beforeAll(() => {
    router = JhhServerRouterUser();
  });

  it('should handle POST request for login', async () => {
    const app: Express = express();
    app.use(router);

    const response = await request(app).post(ApiRoute.Login);
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.text).toBe('Login successful');
  });

  it('should handle POST request for register', async () => {
    const app: Express = express();
    app.use(router);

    const response = await request(app).post(ApiRoute.Register);
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.text).toBe('Registration successful');
  });

  it('should handle DELETE request for remove account', async () => {
    const app: Express = express();
    app.use(router);

    const response = await request(app)
      .delete(ApiRoute.RemoveAccount)
      .set('Authorization', 'Bearer mockTokenHere');

    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.text).toBe('Remove account successful');
  });
});
