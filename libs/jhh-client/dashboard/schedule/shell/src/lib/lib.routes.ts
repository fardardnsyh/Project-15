import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { JhhClientDashboardScheduleShellComponent } from './containers/shell/jhh-client-dashboard-schedule-shell.component';

import {
  SCHEDULE_STATE_KEY,
  ScheduleEffects,
  scheduleReducer,
} from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

export const JhhClientDashboardScheduleShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardScheduleShellComponent,
  providers: [
    provideState(SCHEDULE_STATE_KEY, scheduleReducer),
    provideEffects(ScheduleEffects),
  ],
  children: [
    {
      path: ClientRoute.Schedule,
      title: 'Schedule',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/schedule/feature').then(
              (c) => c.JhhClientDashboardScheduleComponent
            ),
        },
      ],
    },
  ],
};
