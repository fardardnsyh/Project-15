import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { LocalStorageKey, User } from '@jhh/shared/domain';

@Injectable()
export class AuthFacade {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  token$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthToken)
  );

  user$: Observable<User | null> = this.store.pipe(
    select(AuthSelectors.selectAuthUser)
  );

  loginInProgress$: Observable<boolean> = this.store.pipe(
    select(AuthSelectors.selectAuthLoginInProgress)
  );

  loginError$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthLoginError)
  );

  registerInProgress$: Observable<boolean> = this.store.pipe(
    select(AuthSelectors.selectAuthRegisterInProgress)
  );

  registerError$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthRegisterError)
  );

  removeAccountInProgress$: Observable<boolean> = this.store.pipe(
    select(AuthSelectors.selectAuthRemoveAccountInProgress)
  );

  removeAccountError$: Observable<string | null> = this.store.pipe(
    select(AuthSelectors.selectAuthRemoveAccountError)
  );

  login(username: string, password: string) {
    return this.actionResolverService.executeAndWatch(
      AuthActions.login({
        payload: { username: username, password: password },
      }),
      AuthActions.Type.LoginSuccess,
      AuthActions.Type.LoginFail
    );
  }

  register(username: string, password: string, confirmPassword: string) {
    return this.actionResolverService.executeAndWatch(
      AuthActions.register({
        payload: {
          username: username,
          password: password,
          confirmPassword: confirmPassword,
        },
      }),
      AuthActions.Type.RegisterSuccess,
      AuthActions.Type.RegisterFail
    );
  }

  removeAccount() {
    return this.actionResolverService.executeAndWatch(
      AuthActions.removeAccount(),
      AuthActions.Type.RemoveAccountSuccess,
      AuthActions.Type.RemoveAccountFail
    );
  }

  saveToken(token: string): void {
    this.store.dispatch(AuthActions.saveToken({ payload: { token: token } }));
  }

  getToken(): string {
    return this.authService.getToken();
  }

  loginOrRedirect(): void {
    const token: string = this.getToken();

    if (token) {
      this.saveToken(token);
    } else {
      localStorage.removeItem(LocalStorageKey.UnsavedBoardRequestId);
      this.router.navigate([ClientRoute.LoginLink]);
    }
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
