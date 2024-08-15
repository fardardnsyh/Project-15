import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';
import { fetch } from '@nrwl/angular';

import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

import {
  LoginSuccessPayload,
  RegisterSuccessPayload,
} from '@jhh/jhh-client/auth/domain';
import { Router } from '@angular/router';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Injectable()
export class AuthEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      fetch({
        run: (action) =>
          this.authService.login(action.payload).pipe(
            tap((res: LoginSuccessPayload) => {
              this.authService.saveToken(res.token);
              this.router.navigate([ClientRoute.HomeLink]);
            }),
            mergeMap((res: LoginSuccessPayload) => [
              AuthActions.loginSuccess({ payload: res }),
              AuthActions.resetLoginSuccess(),
            ])
          ),
        onError: (action, error) => AuthActions.loginFail({ payload: error }),
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      fetch({
        run: (action) =>
          this.authService.register(action.payload).pipe(
            tap((res: RegisterSuccessPayload) => {
              this.authService.saveToken(res.token);
              this.router.navigate([ClientRoute.HomeLink]);
            }),
            mergeMap((res: RegisterSuccessPayload) => [
              AuthActions.registerSuccess({ payload: res }),
              AuthActions.resetRegisterSuccess(),
            ])
          ),
        onError: (action, error) =>
          AuthActions.registerFail({ payload: error }),
      })
    )
  );

  removeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.removeAccount),
      fetch({
        run: () =>
          this.authService.removeAccount().pipe(
            tap(() => {
              this.authService.removeToken();
            }),
            map(() => AuthActions.removeAccountSuccess())
          ),
        onError: (action, error) =>
          AuthActions.removeAccountFail({ payload: error }),
      })
    )
  );

  saveToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.saveToken),
      distinctUntilChanged(),
      tap((val) => {
        this.authService.saveToken(val.payload.token);
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      distinctUntilChanged(),
      tap(() => {
        this.authService.removeToken();
      })
    )
  );
}
