import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { authGuard } from './auth.guard';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

const inject = require('@angular/core').inject;

describe('authGuard', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockAuthFacade: jest.Mocked<AuthFacade>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockAuthFacade = {
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthFacade>;

    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;

    inject.mockImplementation((token: unknown) => {
      if (token === Router) {
        return mockRouter;
      } else if (token === AuthFacade) {
        return mockAuthFacade;
      }
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to home and return false if token exists', () => {
    mockAuthFacade.getToken.mockReturnValue('some-token');

    const result = authGuard(mockRoute, mockState);

    expect(mockRouter.navigate).toHaveBeenCalledWith([ClientRoute.HomeLink]);
    expect(result).toBe(false);
  });

  it('should return true if no token exists', () => {
    mockAuthFacade.getToken.mockReturnValue(null as any);

    const result = authGuard(mockRoute, mockState);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
