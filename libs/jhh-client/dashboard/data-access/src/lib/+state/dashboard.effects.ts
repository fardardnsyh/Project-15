import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  take,
} from 'rxjs/operators';
import { fetch } from '@nrwl/angular';
import { from, of, timer } from 'rxjs';
import { HttpStatusCode, LocalStorageKey } from '@jhh/shared/domain';

import * as DashboardActions from './dashboard.actions';
import { DashboardFacade } from './dashboard.facade';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '@jhh/jhh-client/auth/data-access';

import { LoadAssignedDataSuccessPayload } from '@jhh/jhh-client/dashboard/domain';

@Injectable()
export class DashboardEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly dashboardService: DashboardService =
    inject(DashboardService);
  private readonly dashboardFacade: DashboardFacade = inject(DashboardFacade);
  private readonly authService: AuthService = inject(AuthService);

  loadAssignedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadAssignedData),
      fetch({
        run: () => {
          return this.dashboardService.loadAssignedData().pipe(
            map((res: LoadAssignedDataSuccessPayload) => {
              const unsavedBoardRequestId: string | null = localStorage.getItem(
                LocalStorageKey.UnsavedBoardRequestId
              );
              if (
                unsavedBoardRequestId?.length &&
                res.unsavedBoardRequestId !== unsavedBoardRequestId
              ) {
                throw new Error('Board update still pending');
              }
              return res;
            }),
            retryWhen((errors) =>
              errors.pipe(
                switchMap((error, index) => {
                  const attempt: number = index + 1;

                  if (error?.status === HttpStatusCode.NotFound) {
                    this.authService.removeToken();
                  }

                  if (attempt >= 10) {
                    localStorage.removeItem(
                      LocalStorageKey.UnsavedBoardRequestId
                    );
                    window.location.reload();
                  }

                  return timer(3000);
                }),
                take(10)
              )
            ),
            mergeMap((res) => {
              this.dashboardFacade.setData({ payload: res });
              localStorage.removeItem(LocalStorageKey.UnsavedBoardRequestId);
              return from([
                DashboardActions.loadAssignedDataSuccess({ payload: res }),
                DashboardActions.resetLoadAssignedDataSuccess(),
              ]);
            }),
            catchError((error) => {
              return of(
                DashboardActions.loadAssignedDataFail({ payload: error })
              );
            })
          );
        },
        onError: (action, error) => {
          return DashboardActions.loadAssignedDataFail({ payload: error });
        },
      })
    )
  );
}
