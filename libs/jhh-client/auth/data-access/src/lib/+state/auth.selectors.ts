import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AUTH_STATE_KEY, AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_STATE_KEY);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthLoginInProgress = createSelector(
  selectAuthState,
  (state: AuthState) => state.login.inProgress
);

export const selectAuthLoginError = createSelector(
  selectAuthState,
  (state: AuthState) => state.login.error
);

export const selectAuthRegisterInProgress = createSelector(
  selectAuthState,
  (state: AuthState) => state.register.inProgress
);

export const selectAuthRegisterError = createSelector(
  selectAuthState,
  (state: AuthState) => state.register.error
);

export const selectAuthRemoveAccountInProgress = createSelector(
  selectAuthState,
  (state: AuthState) => state.removeAccount.inProgress
);

export const selectAuthRemoveAccountError = createSelector(
  selectAuthState,
  (state: AuthState) => state.removeAccount.error
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);
