import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { JhhClientDashboardShellComponent } from './containers/shell/jhh-client-dashboard-shell.component';

import { AuthPublicFacade, authPublicGuard } from '@jhh/jhh-client/auth/public';

import {
  DASHBOARD_STATE_KEY,
  DashboardEffects,
  DashboardFacade,
  dashboardReducer,
} from '@jhh/jhh-client/dashboard/data-access';
import {
  NOTES_STATE_KEY,
  NotesFacade,
  notesReducer,
} from '@jhh/jhh-client/dashboard/notes/data-access';
import {
  BOARD_STATE_KEY,
  boardReducer,
} from '@jhh/jhh-client/dashboard/board/data-access';
import {
  OFFERS_STATE_KEY,
  OffersEffects,
  offersReducer,
} from '@jhh/jhh-client/dashboard/offers/data-access';
import {
  SCHEDULE_STATE_KEY,
  scheduleReducer,
} from '@jhh/jhh-client/dashboard/schedule/data-access';
import {
  PRACTICE_STATE_KEY,
  practiceReducer,
} from '@jhh/jhh-client/dashboard/practice/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { JhhClientDashboardNotesShellRoutes } from '@jhh/jhh-client/dashboard/notes/shell';
import { JhhClientDashboardBoardShellRoutes } from '@jhh/jhh-client/dashboard/board/shell';
import { JhhClientDashboardOffersShellRoutes } from '@jhh/jhh-client/dashboard/offers/shell';
import { JhhClientDashboardScheduleShellRoutes } from '@jhh/jhh-client/dashboard/schedule/shell';
import { JhhClientDashboardPracticeShellRoutes } from '@jhh/jhh-client/dashboard/practice/shell';

export const JhhClientDashboardShellRoutes: Route = {
  path: ClientRoute.Home,
  title: 'Home',
  component: JhhClientDashboardShellComponent,
  providers: [
    provideState(DASHBOARD_STATE_KEY, dashboardReducer),
    provideState(NOTES_STATE_KEY, notesReducer),
    provideState(BOARD_STATE_KEY, boardReducer),
    provideState(OFFERS_STATE_KEY, offersReducer),
    provideState(SCHEDULE_STATE_KEY, scheduleReducer),
    provideState(PRACTICE_STATE_KEY, practiceReducer),
    provideEffects(DashboardEffects, OffersEffects),
    AuthPublicFacade,
    DashboardFacade,
    NotesFacade,
  ],
  canActivate: [authPublicGuard],
  children: [
    JhhClientDashboardNotesShellRoutes,
    JhhClientDashboardBoardShellRoutes,
    JhhClientDashboardOffersShellRoutes,
    JhhClientDashboardScheduleShellRoutes,
    JhhClientDashboardPracticeShellRoutes,
  ],
};
