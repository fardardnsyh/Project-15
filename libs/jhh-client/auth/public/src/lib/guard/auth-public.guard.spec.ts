import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AuthPublicFacade } from '../+state/auth-public.facade';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { authPublicGuard } from './auth-public.guard';

const mockAuthFacade = {
  loginOrRedirect: jest.fn(),
};

describe('authPublicGuard', () => {
  let authPublicFacade: AuthPublicFacade;
  let authFacade: AuthFacade;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authPublicGuard(...guardParameters));

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthPublicFacade,
        {
          provide: AuthFacade,
          useValue: mockAuthFacade,
        },
      ],
    });

    authPublicFacade = TestBed.inject(AuthPublicFacade);
    authFacade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  describe('loginOrRedirect', () => {
    it('should call loginOrRedirect in authFacade', () => {
      authPublicFacade.loginOrRedirect();

      expect(authFacade.loginOrRedirect).toHaveBeenCalled();
    });
  });
});
