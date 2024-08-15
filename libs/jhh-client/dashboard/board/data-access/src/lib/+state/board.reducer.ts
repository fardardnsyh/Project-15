import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as BoardActions from './board.actions';

import { BoardColumn } from '@jhh/shared/domain';
import { OperationState } from '@jhh/jhh-client/shared/domain';

import { ResetOperationStateError } from '@jhh/jhh-client/shared/util-reset-operation-state-error';

export const BOARD_STATE_KEY = 'board';

export interface BoardState extends EntityState<BoardColumn> {
  addBoardColumn: OperationState;
  editBoardColumn: OperationState;
  duplicateBoardColumn: OperationState;
  removeBoardColumn: OperationState;
  updateBoardColumns: OperationState;
}

export const adapter: EntityAdapter<BoardColumn> =
  createEntityAdapter<BoardColumn>();

export const initialBoardState: BoardState = adapter.getInitialState({
  addBoardColumn: {
    inProgress: false,
    error: null,
    success: false,
  },
  editBoardColumn: {
    inProgress: false,
    error: null,
    success: false,
  },
  duplicateBoardColumn: {
    inProgress: false,
    error: null,
  },
  removeBoardColumn: {
    inProgress: false,
    error: null,
  },
  updateBoardColumns: {
    inProgress: false,
    error: null,
  },
});

const reducer: ActionReducer<BoardState> = createReducer(
  initialBoardState,
  on(BoardActions.setBoard, (state, { boardColumns }) =>
    adapter.setAll(boardColumns, state)
  ),
  on(BoardActions.addBoardColumn, (state) => ({
    ...state,
    addBoardColumn: {
      ...state.addBoardColumn,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(BoardActions.addBoardColumnFail, (state, { payload }) => ({
    ...state,
    addBoardColumn: {
      ...state.addBoardColumn,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.addBoardColumnSuccess, (state, { payload }) => {
    const updatedState: BoardState = adapter.addOne(
      payload.newBoardColumn,
      state
    );

    return {
      ...updatedState,
      addBoardColumn: {
        inProgress: false,
        error: null,
        success: true,
      },
    };
  }),
  on(BoardActions.resetAddBoardColumnSuccess, (state) => ({
    ...state,
    addBoardColumn: {
      ...state.addBoardColumn,
      success: false,
    },
  })),
  on(BoardActions.editBoardColumn, (state) => ({
    ...state,
    editBoardColumn: {
      ...state.editBoardColumn,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(BoardActions.editBoardColumnFail, (state, { payload }) => ({
    ...state,
    editBoardColumn: {
      ...state.editBoardColumn,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.editBoardColumnSuccess, (state, { payload }) => {
    const updatedState: BoardState = adapter.updateOne(
      {
        id: payload.editedBoardColumn.id,
        changes: {
          updatedAt: payload.editedBoardColumn.updatedAt,
          name: payload.editedBoardColumn.name,
          color: payload.editedBoardColumn.color,
        },
      },
      state
    );

    return {
      ...updatedState,
      editBoardColumn: {
        inProgress: false,
        error: null,
        success: true,
      },
    };
  }),
  on(BoardActions.resetEditBoardColumnSuccess, (state) => ({
    ...state,
    editBoardColumn: {
      ...state.editBoardColumn,
      success: false,
    },
  })),
  on(BoardActions.duplicateBoardColumn, (state) => ({
    ...state,
    duplicateBoardColumn: {
      ...state.duplicateBoardColumn,
      inProgress: true,
      error: null,
    },
  })),
  on(BoardActions.duplicateBoardColumnFail, (state, { payload }) => ({
    ...state,
    duplicateBoardColumn: {
      ...state.duplicateBoardColumn,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.duplicateBoardColumnSuccess, (state, { payload }) => {
    const updatedState: BoardState = adapter.addOne(
      payload.duplicatedBoardColumn,
      state
    );

    return {
      ...updatedState,
      duplicateBoardColumn: {
        inProgress: false,
        error: null,
      },
    };
  }),
  on(BoardActions.resetDuplicateBoardColumnSuccess, (state) => ({
    ...state,
    duplicateBoardColumn: {
      ...state.duplicateBoardColumn,
      success: false,
    },
  })),
  on(BoardActions.removeBoardColumn, (state) => ({
    ...state,
    removeBoardColumn: {
      ...state.removeBoardColumn,
      inProgress: true,
      error: null,
    },
  })),
  on(BoardActions.removeBoardColumnFail, (state, { payload }) => ({
    ...state,
    removeBoardColumn: {
      ...state.removeBoardColumn,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.removeBoardColumnSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    delete updatedEntities[payload.removedBoardColumn.id];
    const definedEntities = Object.values(updatedEntities).filter(
      (column): column is BoardColumn => column !== undefined
    );

    return adapter.setAll(definedEntities, {
      ...state,
      removeBoardColumn: {
        ...state.removeBoardColumn,
        inProgress: false,
      },
    });
  }),
  on(BoardActions.resetRemoveBoardColumnSuccess, (state) => ({
    ...state,
    removeBoardColumn: {
      ...state.removeBoardColumn,
      success: false,
    },
  })),
  on(BoardActions.updateBoardColumns, (state) => ({
    ...state,
    updateBoardColumns: {
      ...state.updateBoardColumns,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(BoardActions.updateBoardColumnsFail, (state, { payload }) => ({
    ...state,
    updateBoardColumns: {
      ...state.updateBoardColumns,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(BoardActions.updateBoardColumnsSuccess, (state, { payload }) => {
    const updates = payload.updatedColumns.map((updatedColumn) => ({
      id: updatedColumn.id,
      changes: {
        order: updatedColumn.order,
        items: updatedColumn.items,
      },
    }));

    let updatedState: BoardState = adapter.updateMany(updates, state);

    const sortedColumns: BoardColumn[] = Object.values(updatedState.entities)
      .filter((column): column is BoardColumn => column !== undefined)
      .sort((a, b) => a.order - b.order);

    updatedState = {
      ...updatedState,
      ids: sortedColumns.map((column) => column.id),
      updateBoardColumns: {
        ...state.updateBoardColumns,
        inProgress: false,
        error: null,
        success: true,
      },
    };

    return updatedState;
  }),
  on(BoardActions.resetUpdateBoardColumnsSuccess, (state) => ({
    ...state,
    updateBoardColumns: {
      ...state.updateBoardColumns,
      success: false,
    },
  })),
  on(BoardActions.resetErrors, (state) => {
    return {
      ...state,
      addBoardColumn: ResetOperationStateError(state.addBoardColumn),
      editBoardColumn: ResetOperationStateError(state.editBoardColumn),
      duplicateBoardColumn: ResetOperationStateError(
        state.duplicateBoardColumn
      ),
      removeBoardColumn: ResetOperationStateError(state.removeBoardColumn),
      updateBoardColumns: ResetOperationStateError(state.updateBoardColumns),
    };
  })
);

export function boardReducer(state: BoardState | undefined, action: Action) {
  return reducer(state, action);
}
