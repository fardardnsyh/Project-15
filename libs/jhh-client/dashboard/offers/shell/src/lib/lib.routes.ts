import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { JhhClientDashboardOffersShellComponent } from './containers/shell/jhh-client-dashboard-offers-shell.component';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import {
  OFFERS_STATE_KEY,
  OffersEffects,
  offersReducer,
} from '@jhh/jhh-client/dashboard/offers/data-access';

export const JhhClientDashboardOffersShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardOffersShellComponent,
  providers: [
    provideState(OFFERS_STATE_KEY, offersReducer),
    provideEffects(OffersEffects),
  ],
  children: [
    {
      path: ClientRoute.Offers,
      title: 'Offers',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/offers/feature').then(
              (c) => c.JhhClientDashboardOffersComponent
            ),
        },
        {
          path: ':offerSlug',
          title: 'Offer',
          loadComponent: () =>
            import(
              '@jhh/jhh-client/dashboard/offers/feature-single-offer'
            ).then((c) => c.JhhClientDashboardOffersSingleOfferComponent),
        },
      ],
    },
  ],
};
