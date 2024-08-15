import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, BOARD_STATE_KEY, BoardState } from './board.reducer';

import { BoardColumn } from '@jhh/shared/domain';

export const selectBoardState =
  createFeatureSelector<BoardState>(BOARD_STATE_KEY);

export const {
  selectIds: selectColumnIds,
  selectEntities: selectColumnsEntities,
  selectAll: selectAllColumns,
  selectTotal: selectTotalColumns,
} = adapter.getSelectors(selectBoardState);

export const selectBoardColumns = createSelector(
  selectAllColumns,
  (boardColumns: BoardColumn[]) => boardColumns
);

export const selectAddBoardColumnInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.addBoardColumn.inProgress
);

export const selectAddBoardColumnError = createSelector(
  selectBoardState,
  (state: BoardState) => state.addBoardColumn.error
);

export const selectAddBoardColumnSuccess = createSelector(
  selectBoardState,
  (state: BoardState) => state.addBoardColumn.success!
);

export const selectEditBoardColumnInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.editBoardColumn.inProgress
);

export const selectEditBoardColumnError = createSelector(
  selectBoardState,
  (state: BoardState) => state.editBoardColumn.error
);

export const selectEditBoardColumnSuccess = createSelector(
  selectBoardState,
  (state: BoardState) => state.editBoardColumn.success!
);

export const selectDuplicateBoardColumnInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.duplicateBoardColumn.inProgress
);

export const selectDuplicateBoardColumnError = createSelector(
  selectBoardState,
  (state: BoardState) => state.duplicateBoardColumn.error
);

export const selectRemoveBoardColumnInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.removeBoardColumn.inProgress
);

export const selectRemoveBoardColumnError = createSelector(
  selectBoardState,
  (state: BoardState) => state.removeBoardColumn.error
);

export const selectUpdateBoardColumnsInProgress = createSelector(
  selectBoardState,
  (state: BoardState) => state.updateBoardColumns.inProgress
);

export const selectUpdateBoardColumnsError = createSelector(
  selectBoardState,
  (state: BoardState) => state.updateBoardColumns.error
);

export const selectUpdateBoardColumnsSuccess = createSelector(
  selectBoardState,
  (state: BoardState) => state.updateBoardColumns.success!
);

export const selectLimitedColumns = createSelector(
  selectAllColumns,
  (columns: BoardColumn[], props: { length: number }) =>
    columns.slice(0, props.length)
);
