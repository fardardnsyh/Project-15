import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap, tap } from 'rxjs/operators';

import * as BoardActions from './board.actions';

import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

import {
  AddBoardColumnSuccessPayload,
  DuplicateBoardColumnSuccessPayload,
  EditBoardColumnSuccessPayload,
  RemoveBoardColumnSuccessPayload,
  UpdateBoardColumnsSuccessPayload,
} from '@jhh/jhh-client/dashboard/board/domain';

import { BoardService } from '../services/board.service';
import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BoardEffects {
  private readonly actions$ = inject(Actions);
  private readonly boardService: BoardService = inject(BoardService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  addBoardColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.addBoardColumn),
      fetch({
        run: (action) =>
          this.boardService.addBoardColumn(action.payload).pipe(
            mergeMap((res: AddBoardColumnSuccessPayload) => [
              BoardActions.addBoardColumnSuccess({ payload: res }),
              BoardActions.resetAddBoardColumnSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('New column added successfully!');
            })
          ),
        onError: (action, error) =>
          BoardActions.addBoardColumnFail({ payload: error }),
      })
    )
  );

  editBoardColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.editBoardColumn),
      fetch({
        run: (action) =>
          this.boardService.editBoardColumn(action.payload).pipe(
            mergeMap((res: EditBoardColumnSuccessPayload) => [
              BoardActions.editBoardColumnSuccess({ payload: res }),
              BoardActions.resetEditBoardColumnSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Column edited successfully!');
            })
          ),
        onError: (action, error) =>
          BoardActions.editBoardColumnFail({ payload: error }),
      })
    )
  );

  duplicateBoardColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.duplicateBoardColumn),
      fetch({
        run: (action) => {
          const snackbarRef: MatSnackBarRef<SimpleSnackBar> =
            this.snackbarService.openIndefinite('Duplicating column...');
          return this.boardService.duplicateBoardColumn(action.payload).pipe(
            mergeMap((res: DuplicateBoardColumnSuccessPayload) => [
              BoardActions.duplicateBoardColumnSuccess({ payload: res }),
              BoardActions.resetDuplicateBoardColumnSuccess(),
            ]),
            tap(() => {
              snackbarRef.dismiss();
              this.snackbarService.open('Column duplicated successfully!');
            })
          );
        },
        onError: (action, error) => {
          this.snackbarService.open(
            'Something went wrong when duplicating an board column. Try it again'
          );
          return BoardActions.duplicateBoardColumnFail({ payload: error });
        },
      })
    )
  );

  removeBoardColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.removeBoardColumn),
      fetch({
        run: (action) =>
          this.boardService.removeBoardColumn(action.payload).pipe(
            mergeMap((res: RemoveBoardColumnSuccessPayload) => [
              BoardActions.removeBoardColumnSuccess({ payload: res }),
              BoardActions.resetRemoveBoardColumnSuccess(),
            ]),
            tap(() => {
              this.snackbarService.open('Column removed successfully!');
            })
          ),
        onError: (action, error) =>
          BoardActions.removeBoardColumnFail({ payload: error }),
      })
    )
  );

  updateBoardColumns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.updateBoardColumns),
      fetch({
        run: (action) => {
          const snackbarRef: MatSnackBarRef<SimpleSnackBar> =
            this.snackbarService.openIndefinite('Updating board columns...');
          return this.boardService.updateBoardColumns(action.payload).pipe(
            mergeMap((res: UpdateBoardColumnsSuccessPayload) => [
              BoardActions.updateBoardColumnsSuccess({ payload: res }),
              BoardActions.resetUpdateBoardColumnsSuccess(),
            ]),
            tap(() => {
              snackbarRef.dismiss();
              this.snackbarService.open('Board changes saved successfully!');
            })
          );
        },
        onError: (action, error) => {
          this.snackbarService.open(
            'Something went wrong when updating board data. Refresh and try again.'
          );
          return BoardActions.updateBoardColumnsFail({ payload: error });
        },
      })
    )
  );
}
