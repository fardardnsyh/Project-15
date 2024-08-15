import { Route } from '@angular/router';

import { JhhClientAuthShellRoutes } from '@jhh/jhh-client/auth/shell';
import { JhhClientDashboardShellRoutes } from '@jhh/jhh-client/dashboard/shell';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { JhhClientNotFoundComponent } from '@jhh/jhh-client/feature-not-found';

export const appRoutes: Route[] = [
  { path: '', redirectTo: ClientRoute.HomeLink, pathMatch: 'full' },
  {
    path: ClientRoute.NotFound,
    title: '404 Page not found',
    component: JhhClientNotFoundComponent,
  },
  JhhClientAuthShellRoutes,
  JhhClientDashboardShellRoutes,
  { path: '**', redirectTo: ClientRoute.NotFoundLink },
];
