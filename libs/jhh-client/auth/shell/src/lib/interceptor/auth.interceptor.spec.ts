import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { AuthInterceptor } from './auth.interceptor';

import { ApiRoute, HttpStatusCode } from '@jhh/shared/domain';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

const inject = require('@angular/core').inject;

jest.mock('@jhh/jhh-client/auth/data-access', () => {
  return {
    AuthFacade: jest.fn().mockImplementation(() => {
      return {
        token$: of(null),
        logout: jest.fn(),
      };
    }),
  };
});

describe('AuthInterceptor', () => {
  let authFacade: AuthFacade;
  let next: HttpHandlerFn;
  let req: HttpRequest<unknown>;

  beforeEach(() => {
    authFacade = new AuthFacade();
    inject.mockReturnValue(authFacade);

    next = jest.fn().mockReturnValue(of(null));

    req = new HttpRequest('GET', 'some-url');
  });

  it('should pass the request through if it ends with Login or Register', () => {
    req = new HttpRequest('GET', ApiRoute.Login);

    AuthInterceptor(req, next);

    expect(next).toHaveBeenCalledWith(req);
  });

  it('should add Authorization header if token exists', () => {
    authFacade.token$ = of('some-token');
    AuthInterceptor(req, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          lazyUpdate: expect.arrayContaining([
            expect.objectContaining({
              name: 'Authorization',
              value: 'Bearer some-token',
            }),
          ]),
        }),
      })
    );
  });

  it('should not add Authorization header if token does not exist', () => {
    authFacade.token$ = of(null);
    AuthInterceptor(req, next);

    expect(next).toHaveBeenCalledWith(req);
  });

  it('should call logout if response status is Unauthorized', async () => {
    const error = new HttpErrorResponse({
      status: HttpStatusCode.Unauthorized,
    });

    (next as jest.Mock).mockReturnValue(throwError(error));
    authFacade.logout = jest.fn();

    try {
      await AuthInterceptor(req, next).toPromise();
    } catch (e) {}

    expect(authFacade.logout).toHaveBeenCalled();
  });
});
