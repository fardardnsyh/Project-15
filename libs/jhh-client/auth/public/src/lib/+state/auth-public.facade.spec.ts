import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AuthPublicFacade } from './auth-public.facade';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

const mockAuthFacade = {
  loginOrRedirect: jest.fn(),
};

describe('AuthPublicFacade', () => {
  let authPublicFacade: AuthPublicFacade;
  let authFacade: AuthFacade;

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
        { provide: AuthFacade, useValue: mockAuthFacade },
      ],
    });

    authPublicFacade = TestBed.inject(AuthPublicFacade);
    authFacade = TestBed.inject(AuthFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(authPublicFacade).toBeTruthy();
  });

  describe('loginOrRedirect', () => {
    it('should call loginOrRedirect in AuthFacade', () => {
      authPublicFacade.loginOrRedirect();

      expect(authFacade.loginOrRedirect).toHaveBeenCalled();
    });
  });
});
