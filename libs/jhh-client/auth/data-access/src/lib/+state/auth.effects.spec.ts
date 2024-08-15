import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { TypedAction } from '@ngrx/store/src/models';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';

import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

import {
  LoginPayload,
  LoginSuccessPayload,
  RegisterPayload,
  RegisterSuccessPayload,
} from '@jhh/jhh-client/auth/domain';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('AuthEffects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let authService: jest.Mocked<AuthService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      saveToken: jest.fn(),
      removeToken: jest.fn(),
      removeAccount: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('login$', () => {
    it('should return a loginSuccess action on successful login', () => {
      const payload: LoginSuccessPayload = {
        token: 'some_token',
        user: null as any,
      };
      const action: {
        payload: LoginPayload;
      } & TypedAction<AuthActions.Type.Login> = AuthActions.login({
        payload: { username: 'username', password: 'password' },
      });
      const outcome: {
        payload: LoginSuccessPayload;
      } & TypedAction<AuthActions.Type.LoginSuccess> = AuthActions.loginSuccess(
        { payload }
      );

      actions$ = of(action);
      authService.login.mockReturnValue(of(payload));

      effects.login$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(authService.saveToken).toHaveBeenCalledWith(payload.token);
      });
    });

    it('should return a loginFail action on failed login', () => {
      const error = 'some_error';
      const action: {
        payload: LoginPayload;
      } & TypedAction<AuthActions.Type.Login> = AuthActions.login({
        payload: { username: 'username', password: 'password' },
      });
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { message: 'Login failed' },
        status: 401,
        statusText: 'Unauthorized',
      });
      const outcome: {
        payload: HttpErrorResponse;
      } & TypedAction<AuthActions.Type.LoginFail> = AuthActions.loginFail({
        payload: errorResponse,
      });

      actions$ = of(action);
      authService.login.mockReturnValue(throwError(error));

      effects.login$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('register$', () => {
    it('should return a registerSuccess action on successful registration', () => {
      const payload: RegisterSuccessPayload = {
        token: 'some_token',
        user: null as any,
      };
      const action: {
        payload: RegisterPayload;
      } & TypedAction<AuthActions.Type.Register> = AuthActions.register({
        payload: {
          username: 'username',
          password: 'password',
          confirmPassword: 'password',
        },
      });
      const outcome: {
        payload: RegisterSuccessPayload;
      } & TypedAction<AuthActions.Type.RegisterSuccess> =
        AuthActions.registerSuccess({ payload });

      actions$ = of(action);
      authService.register.mockReturnValue(of(payload));

      effects.register$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(authService.saveToken).toHaveBeenCalledWith(payload.token);
      });
    });

    it('should return a registerFail action on failed registration', () => {
      const error = 'some_error';
      const action: {
        payload: RegisterPayload;
      } & TypedAction<AuthActions.Type.Register> = AuthActions.register({
        payload: {
          username: 'username',
          password: 'password',
          confirmPassword: 'password',
        },
      });
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { message: 'Register failed' },
        status: 400,
        statusText: 'Bad Request',
      });
      const outcome: {
        payload: HttpErrorResponse;
      } & TypedAction<AuthActions.Type.RegisterFail> = AuthActions.registerFail(
        { payload: errorResponse }
      );

      actions$ = of(action);
      authService.register.mockReturnValue(throwError(error));

      effects.register$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('logout$', () => {
    it('should remove token on logout', () => {
      const action: TypedAction<AuthActions.Type.Logout> = AuthActions.logout();

      actions$ = of(action);

      effects.logout$.subscribe(() => {
        expect(authService.removeToken).toHaveBeenCalled();
      });
    });
  });

  describe('removeAccount$', () => {
    it('should dispatch removeAccountSuccess action and remove token on successful account removal', () => {
      const action = AuthActions.removeAccount();
      const outcome = AuthActions.removeAccountSuccess();

      authService.removeAccount.mockReturnValue(
        of({ removedAccountId: 'some_account_id' })
      );

      actions$ = of(action);

      effects.removeAccount$.subscribe((result) => {
        expect(result).toEqual(outcome);
        expect(authService.removeToken).toHaveBeenCalled();
      });
    });

    it('should dispatch removeAccountFail action on failed account removal', () => {
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { message: 'Remove account failed' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = AuthActions.removeAccount();
      const outcome = AuthActions.removeAccountFail({ payload: errorResponse });

      actions$ = of(action);
      authService.removeAccount.mockReturnValue(throwError(errorResponse));

      effects.removeAccount$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('saveToken$', () => {
    it('should call saveToken on authService with the correct payload', () => {
      const token = 'new_token';
      const action = AuthActions.saveToken({ payload: { token } });

      actions$ = of(action);

      effects.saveToken$.subscribe(() => {
        expect(authService.saveToken).toHaveBeenCalledWith(token);
      });
    });
  });
});
