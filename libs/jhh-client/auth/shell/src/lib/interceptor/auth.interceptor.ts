import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, filter } from 'rxjs';
import { inject } from '@angular/core';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { ApiRoute, HttpStatusCode } from '@jhh/shared/domain';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  if (req.url.endsWith(ApiRoute.Login) || req.url.endsWith(ApiRoute.Register)) {
    return next(req);
  }

  let token: string | null;
  const authFacade: AuthFacade = inject(AuthFacade);

  authFacade.token$
    .pipe(filter((tkn: string | null): tkn is string => !!tkn))
    .subscribe((tkn: string) => {
      token = tkn;
    });

  const modifiedReq: HttpRequest<unknown> = token!
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        authFacade.logout();
      }
      throw error;
    })
  );
};
