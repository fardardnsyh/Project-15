import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const router: Router = inject(Router);
  const authFacade: AuthFacade = inject(AuthFacade);

  const token: string = authFacade.getToken();

  if (token) {
    router.navigate([ClientRoute.HomeLink]);
    return false;
  } else {
    return true;
  }
};
