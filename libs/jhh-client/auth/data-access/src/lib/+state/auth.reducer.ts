import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';

import { User } from '@jhh/shared/domain';
import { OperationState } from '@jhh/jhh-client/shared/domain';

export const AUTH_STATE_KEY = 'auth';

export interface AuthState {
  token: string | null;
  login: OperationState;
  register: OperationState;
  removeAccount: OperationState;
  user: User | null;
}

export const initialAuthState: AuthState = {
  token: null,
  login: {
    inProgress: false,
    error: null,
    success: false,
  },
  register: {
    inProgress: false,
    error: null,
    success: false,
  },
  removeAccount: {
    inProgress: false,
    error: null,
    success: false,
  },
  user: null,
};

const reducer: ActionReducer<AuthState> = createReducer(
  initialAuthState,
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user: user,
  })),
  on(AuthActions.login, (state) => ({
    ...state,
    login: {
      ...state.login,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(AuthActions.loginFail, (state, { payload }) => ({
    ...state,
    login: {
      ...state.login,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(AuthActions.loginSuccess, (state, { payload }) => ({
    ...state,
    login: {
      ...state.login,
      inProgress: false,
      error: null,
      success: true,
    },
    register: {
      ...state.register,
      error: null,
    },
    token: payload.token,
    user: payload.user,
  })),
  on(AuthActions.resetLoginSuccess, (state) => ({
    ...state,
    login: {
      ...state.login,
      success: false,
    },
  })),
  on(AuthActions.register, (state) => ({
    ...state,
    register: {
      ...state.register,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(AuthActions.registerFail, (state, { payload }) => ({
    ...state,
    register: {
      ...state.register,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(AuthActions.registerSuccess, (state, { payload }) => ({
    ...state,
    register: {
      ...state.register,
      inProgress: false,
      error: null,
      success: true,
    },
    login: {
      ...state.login,
      error: null,
    },
    token: payload.token,
    user: payload.user,
  })),
  on(AuthActions.resetRegisterSuccess, (state) => ({
    ...state,
    register: {
      ...state.register,
      success: false,
    },
  })),
  on(AuthActions.removeAccount, (state) => ({
    ...state,
    removeAccount: {
      ...state.removeAccount,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(AuthActions.removeAccountFail, (state, { payload }) => ({
    ...state,
    removeAccount: {
      ...state.removeAccount,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(AuthActions.removeAccountSuccess, (state) => ({
    ...state,
    removeAccount: {
      ...state.removeAccount,
      inProgress: false,
      error: null,
      success: true,
    },
    token: null,
    user: null,
  })),
  on(AuthActions.saveToken, (state, { payload }) => ({
    ...state,
    token: payload.token,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    user: null,
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
