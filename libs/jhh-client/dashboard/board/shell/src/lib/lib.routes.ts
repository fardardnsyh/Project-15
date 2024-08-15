import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import {
  BOARD_STATE_KEY,
  BoardEffects,
  boardReducer,
} from '@jhh/jhh-client/dashboard/board/data-access';

import { JhhClientDashboardBoardShellComponent } from './containers/shell/jhh-client-dashboard-board-shell.component';

export const JhhClientDashboardBoardShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardBoardShellComponent,
  providers: [
    provideState(BOARD_STATE_KEY, boardReducer),
    provideEffects(BoardEffects),
  ],
  children: [
    {
      path: ClientRoute.Board,
      title: 'Board',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/board/feature').then(
              (c) => c.JhhClientDashboardBoardComponent
            ),
        },
      ],
    },
  ],
};
