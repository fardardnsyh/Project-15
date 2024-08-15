import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, tap } from 'rxjs/operators';
import { fetch } from '@nrwl/angular';

import * as PracticeActions from './practice.actions';
import { PracticeService } from '../services/practice.service';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';

import {
  AddQuizResultsSuccessPayload,
  AddQuizSuccessPayload,
  EditQuizSuccessPayload,
  RemoveQuizSuccessPayload,
} from '@jhh/jhh-client/dashboard/practice/domain';

@Injectable()
export class PracticeEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);
  private readonly practiceService: PracticeService = inject(PracticeService);
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);

  addQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PracticeActions.addQuiz),
      fetch({
        run: (action) =>
          this.practiceService.addQuiz(action.payload).pipe(
            mergeMap((res: AddQuizSuccessPayload) => [
              PracticeActions.addQuizSuccess({ payload: res }),
              PracticeActions.resetAddQuizSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Practice quiz added successfully!');
            })
          ),
        onError: (action, error) =>
          PracticeActions.addQuizFail({ payload: error }),
      })
    )
  );

  editQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PracticeActions.editQuiz),
      fetch({
        run: (action) =>
          this.practiceService.editQuiz(action.payload).pipe(
            mergeMap((res: EditQuizSuccessPayload) => [
              PracticeActions.editQuizSuccess({ payload: res }),
              PracticeActions.resetEditQuizSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Practice quiz edited successfully!');
            })
          ),
        onError: (action, error) =>
          PracticeActions.editQuizFail({ payload: error }),
      })
    )
  );

  removeQuiz$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PracticeActions.removeQuiz),
      fetch({
        run: (action) =>
          this.practiceService.removeQuiz(action.payload).pipe(
            mergeMap((res: RemoveQuizSuccessPayload) => [
              PracticeActions.removeQuizSuccess({ payload: res }),
              PracticeActions.resetRemoveQuizSuccess(),
            ]),
            tap(() => {
              this.removePracticeQuizDialogService.clearQuizToRemove();
              this.snackbarService.open('Practice quiz removed successfully!');
            })
          ),
        onError: (action, error) =>
          PracticeActions.removeQuizFail({ payload: error }),
      })
    )
  );

  addQuizResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PracticeActions.addQuizResults),
      fetch({
        run: (action) =>
          this.practiceService.addQuizResults(action.payload).pipe(
            mergeMap((res: AddQuizResultsSuccessPayload) => [
              PracticeActions.addQuizResultsSuccess({ payload: res }),
              PracticeActions.resetAddQuizResultsSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Quiz results saved successfully!');
            })
          ),
        onError: (action, error) => {
          this.snackbarService.open(
            'Something went wrong when saving quiz results.'
          );
          return PracticeActions.addQuizResultsFail({ payload: error });
        },
      })
    )
  );
}
