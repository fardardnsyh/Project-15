import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { BoardColumn, BoardColumnItem } from '@jhh/shared/domain';

import * as BoardSelectors from './board.selectors';
import * as BoardActions from './board.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import {
  RemoveBoardColumnPayload,
  UpdateBoardColumnsPayload,
} from '@jhh/jhh-client/dashboard/board/domain';

@Injectable({
  providedIn: 'root',
})
export class BoardFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  boardColumns$: Observable<BoardColumn[]> = this.store.pipe(
    select(BoardSelectors.selectBoardColumns)
  );

  addBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectAddBoardColumnInProgress)
  );

  addBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectAddBoardColumnError)
  );

  addBoardColumnSuccess$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectAddBoardColumnSuccess)
  );

  editBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectEditBoardColumnInProgress)
  );

  editBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectEditBoardColumnError)
  );

  editBoardColumnSuccess$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectEditBoardColumnSuccess)
  );

  duplicateBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectDuplicateBoardColumnInProgress)
  );

  duplicateBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectDuplicateBoardColumnError)
  );

  removeBoardColumnInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectRemoveBoardColumnInProgress)
  );

  removeBoardColumnError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectRemoveBoardColumnError)
  );

  updateBoardColumnsInProgress$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectUpdateBoardColumnsInProgress)
  );

  updateBoardColumnsError$: Observable<string | null> = this.store.pipe(
    select(BoardSelectors.selectUpdateBoardColumnsError)
  );

  updateBoardColumnsSuccess$: Observable<boolean> = this.store.pipe(
    select(BoardSelectors.selectUpdateBoardColumnsSuccess)
  );

  addBoardColumn(name: string, color: string) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.addBoardColumn({
        payload: { name: name, color: color },
      }),
      BoardActions.Type.AddBoardColumnSuccess,
      BoardActions.Type.AddBoardColumnFail
    );
  }

  editBoardColumn(columnId: string, name: string, color: string) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.editBoardColumn({
        payload: { columnId: columnId, name: name, color: color },
      }),
      BoardActions.Type.EditBoardColumnSuccess,
      BoardActions.Type.EditBoardColumnFail
    );
  }

  duplicateBoardColumn(columnId: string, items: BoardColumnItem[]) {
    return this.actionResolverService.executeAndWatch(
      BoardActions.duplicateBoardColumn({
        payload: { columnId: columnId, items: items },
      }),
      BoardActions.Type.DuplicateBoardColumnSuccess,
      BoardActions.Type.DuplicateBoardColumnFail
    );
  }

  removeBoardColumn(columnId: string, unsavedBoardRequestId?: string) {
    const payload: RemoveBoardColumnPayload = unsavedBoardRequestId
      ? { columnId, unsavedBoardRequestId }
      : { columnId };

    return this.actionResolverService.executeAndWatch(
      BoardActions.removeBoardColumn({
        payload: payload,
      }),
      BoardActions.Type.RemoveBoardColumnSuccess,
      BoardActions.Type.RemoveBoardColumnFail
    );
  }

  updateBoardColumns(
    columnsToUpdate: Partial<BoardColumn | null>[],
    removedItemIds: string[],
    unsavedBoardRequestId?: string
  ) {
    const payload: UpdateBoardColumnsPayload = unsavedBoardRequestId
      ? { columnsToUpdate, removedItemIds, unsavedBoardRequestId }
      : { columnsToUpdate, removedItemIds };

    return this.actionResolverService.executeAndWatch(
      BoardActions.updateBoardColumns({
        payload: payload,
      }),
      BoardActions.Type.UpdateBoardColumnsSuccess,
      BoardActions.Type.UpdateBoardColumnsFail
    );
  }

  getLimitedColumns$(length: number = 5): Observable<BoardColumn[]> {
    return this.store.pipe(
      select(BoardSelectors.selectLimitedColumns, { length })
    );
  }

  resetErrors(): void {
    this.store.dispatch(BoardActions.resetErrors());
  }
}
