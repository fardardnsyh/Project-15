import { inject, Injectable } from '@angular/core';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

@Injectable()
export class AuthPublicFacade {
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  loginOrRedirect(): void {
    this.authFacade.loginOrRedirect();
  }
}
