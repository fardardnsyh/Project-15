import '@angular/compiler';

import { AuthState } from './auth.reducer';
import * as AuthSelectors from './auth.selectors';

import { User } from '@jhh/shared/domain';

describe('Auth Selectors', () => {
  const ERROR_MSG = 'Dummy error';

  let state: { [AUTH_STATE_KEY: string]: AuthState };

  const dummyUser: User = {
    id: '1337',
    createdAt: new Date(),
    username: 'username',
  };

  beforeEach(() => {
    state = {
      auth: {
        token: 'token',
        user: dummyUser,
        login: {
          error: ERROR_MSG,
          inProgress: false,
        },
        register: {
          error: ERROR_MSG,
          inProgress: false,
        },
        removeAccount: {
          error: ERROR_MSG,
          inProgress: false,
        },
      },
    };
  });

  it('selectAuthToken() should return the token', () => {
    const result = AuthSelectors.selectAuthToken(state);

    expect(result).toBe('token');
  });

  it('selectAuthLoginInProgress() should return loginInProgress', () => {
    const result = AuthSelectors.selectAuthLoginInProgress(state);

    expect(result).toBe(false);
  });

  it('selectAuthLoginError() should return loginError', () => {
    const result = AuthSelectors.selectAuthLoginError(state);

    expect(result).toBe(ERROR_MSG);
  });

  it('selectAuthRegisterInProgress() should return registerInProgress', () => {
    const result = AuthSelectors.selectAuthRegisterInProgress(state);

    expect(result).toBe(false);
  });

  it('selectAuthRegisterError() should return registerError', () => {
    const result = AuthSelectors.selectAuthRegisterError(state);

    expect(result).toBe(ERROR_MSG);
  });

  it('selectAuthUser() should return user', () => {
    const result = AuthSelectors.selectAuthUser(state);

    expect(result).toEqual(dummyUser);
  });
});
