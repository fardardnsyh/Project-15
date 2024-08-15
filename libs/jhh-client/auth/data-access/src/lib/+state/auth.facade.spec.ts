import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';

import { AuthFacade } from './auth.facade';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

describe('AuthFacade', () => {
  let store: MockStore;
  let facade: AuthFacade;
  let mockAuthService: { getToken: jest.Mock<any, any, any> };
  let mockActionResolverService: { executeAndWatch: jest.Mock<any, any, any> };

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockAuthService = {
      getToken: jest.fn(),
    };

    mockActionResolverService = {
      executeAndWatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        provideMockStore(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    facade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('login', () => {
    it('should dispatch login action', () => {
      const username = 'testUser';
      const password = 'testPassword';
      facade.login(username, password);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        AuthActions.login({ payload: { username, password } }),
        AuthActions.Type.LoginSuccess,
        AuthActions.Type.LoginFail
      );
    });
  });

  describe('register', () => {
    it('should dispatch register action', () => {
      const username = 'testUser';
      const password = 'testPassword';
      const confirmPassword = 'testPassword';
      facade.register(username, password, confirmPassword);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        AuthActions.register({
          payload: { username, password, confirmPassword },
        }),
        AuthActions.Type.RegisterSuccess,
        AuthActions.Type.RegisterFail
      );
    });
  });

  describe('saveToken', () => {
    it('should dispatch saveToken action', () => {
      const token = 'testToken';
      facade.saveToken(token);
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.saveToken({ payload: { token } })
      );
    });
  });

  describe('getToken', () => {
    it('should get token from AuthService', () => {
      const token = 'testToken';
      mockAuthService.getToken.mockReturnValue(token);
      expect(facade.getToken()).toEqual(token);
    });
  });

  describe('logout', () => {
    it('should dispatch logout action', () => {
      facade.logout();
      expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
    });
  });

  describe('removeAccount', () => {
    it('should dispatch removeAccount action', () => {
      facade.removeAccount();
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        AuthActions.removeAccount(),
        AuthActions.Type.RemoveAccountSuccess,
        AuthActions.Type.RemoveAccountFail
      );
    });
  });

  describe('loginOrRedirect', () => {
    it('should save token if token is present', () => {
      const token = 'valid_token';
      mockAuthService.getToken.mockReturnValue(token);
      jest.spyOn(facade, 'saveToken');

      facade.loginOrRedirect();

      expect(facade.saveToken).toHaveBeenCalledWith(token);
    });

    it('should navigate to login if token is not present', () => {
      const mockRouter = TestBed.inject(Router);
      jest.spyOn(mockRouter, 'navigate');
      mockAuthService.getToken.mockReturnValue('');

      facade.loginOrRedirect();

      expect(mockRouter.navigate).toHaveBeenCalledWith([ClientRoute.LoginLink]);
    });
  });
});
