import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';

import { JhhClientDashboardPracticeShellComponent } from './containers/shell/jhh-client-dashboard-practice-shell.component';

import {
  PRACTICE_STATE_KEY,
  PracticeEffects,
  practiceReducer,
} from '@jhh/jhh-client/dashboard/practice/data-access';

export const JhhClientDashboardPracticeShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardPracticeShellComponent,
  providers: [
    provideState(PRACTICE_STATE_KEY, practiceReducer),
    provideEffects(PracticeEffects),
  ],
  children: [
    {
      path: ClientRoute.Practice,
      title: 'Practice',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/practice/feature').then(
              (c) => c.JhhClientDashboardPracticeComponent
            ),
        },
        {
          path: ':quizSlug',
          title: 'Quiz',
          loadComponent: () =>
            import(
              '@jhh/jhh-client/dashboard/practice/feature-single-quiz'
            ).then((c) => c.JhhClientDashboardPracticeSingleQuizComponent),
        },
      ],
    },
  ],
};
