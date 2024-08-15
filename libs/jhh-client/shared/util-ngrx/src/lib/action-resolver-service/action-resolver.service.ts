import { inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import {
  catchError,
  filter,
  first,
  Observable,
  switchMap,
  takeUntil,
  throwError,
  timer,
} from 'rxjs';

interface ActionWithPayload<T> extends Action {
  payload: T;
}

@Injectable({
  providedIn: 'root',
})
export class ActionResolverService {
  private readonly store: Store;
  private readonly actions$: Actions;

  constructor() {
    this.store = inject(Store);
    this.actions$ = inject(Actions);
  }

  executeAndWatch<T, ErrorType extends string | undefined>(
    initialAction: Action,
    successActionType: string,
    failureActionType: string,
    duration: number = 30000
  ): Observable<T> {
    const timeout$ = timer(duration);

    this.store.dispatch(initialAction);

    return this.actions$.pipe(
      filter(
        (action) =>
          action.type === successActionType || action.type === failureActionType
      ),
      first(),
      switchMap((action) => {
        if (action.type === successActionType) {
          return [(action as ActionWithPayload<T>).payload];
        }
        const errorPayload = (action as ActionWithPayload<ErrorType>).payload;
        throw new Error(errorPayload || 'Operation failed');
      }),
      takeUntil(timeout$),
      catchError((error) => {
        if (!error) {
          return throwError(() => new Error('Operation timed out'));
        }
        return throwError(() => error);
      })
    );
  }
}
