import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { filter, first, map, Observable, tap } from 'rxjs';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { AuthPublicFacade } from '../+state/auth-public.facade';

export const authPublicGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const authFacade: AuthFacade = inject(AuthFacade);
  const authPublicFacade: AuthPublicFacade = inject(AuthPublicFacade);

  return authFacade.token$.pipe(
    tap((token: string | null) => {
      if (!token) {
        authPublicFacade.loginOrRedirect();
      }
    }),
    filter((token): token is string => token !== null),
    first(),
    map(() => true)
  );
};
