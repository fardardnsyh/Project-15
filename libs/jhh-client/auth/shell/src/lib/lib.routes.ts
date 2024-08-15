import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { JhhClientAuthShellComponent } from './containers/shell/jhh-client-auth-shell.component';

import {
  AUTH_STATE_KEY,
  AuthEffects,
  authReducer,
} from '@jhh/jhh-client/auth/data-access';

import { authGuard } from './guard/auth.guard';

export const JhhClientAuthShellRoutes: Route = {
  path: '',
  component: JhhClientAuthShellComponent,
  providers: [
    provideState(AUTH_STATE_KEY, authReducer),
    provideEffects(AuthEffects),
  ],
  canActivate: [authGuard],
  children: [
    {
      path: ClientRoute.Register,
      title: 'Register',
      loadComponent: () =>
        import('@jhh/jhh-client/auth/feature-register').then(
          (c) => c.JhhClientAuthRegisterComponent
        ),
    },
    {
      path: ClientRoute.Login,
      title: 'Login',
      loadComponent: () =>
        import('@jhh/jhh-client/auth/feature-login').then(
          (c) => c.JhhClientAuthLoginComponent
        ),
    },
  ],
};
