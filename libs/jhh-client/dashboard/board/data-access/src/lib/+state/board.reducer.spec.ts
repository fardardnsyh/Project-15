import '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';

import { boardReducer, initialBoardState } from './board.reducer';

import * as BoardActions from './board.actions';
import {
  AddBoardColumnSuccessPayload,
  EditBoardColumnSuccessPayload,
} from '@jhh/jhh-client/dashboard/board/domain';
import { Dictionary } from '@ngrx/entity';
import { BoardColumn } from '@jhh/shared/domain';

describe('BoardReducer', () => {
  describe('addBoardColumn actions', () => {
    it('should set addBoardColumn inProgress to true on addBoardColumn', () => {
      const action = BoardActions.addBoardColumn({
        payload: { name: 'New Column', color: '#FF0000' },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.addBoardColumn.inProgress).toBe(true);
      expect(state.addBoardColumn.success).toBe(false);
      expect(state.addBoardColumn.error).toBe(null);
    });

    it('should add a new board column and set addBoardColumn success to true on addBoardColumnSuccess', () => {
      const newBoardColumn = {
        id: '1',
        name: 'New Column',
        color: '#FF0000',
        items: [],
      };
      const action = BoardActions.addBoardColumnSuccess({
        payload: { newBoardColumn } as unknown as AddBoardColumnSuccessPayload,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.entities[newBoardColumn.id]).toEqual(newBoardColumn);
      expect(state.addBoardColumn.inProgress).toBe(false);
      expect(state.addBoardColumn.success).toBe(true);
    });

    it('should update state with error information on addBoardColumnFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add column' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = BoardActions.addBoardColumnFail({
        payload: errorResponse,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.addBoardColumn.error).toBe('Failed to add column');
      expect(state.addBoardColumn.inProgress).toBe(false);
    });
  });

  describe('editBoardColumn actions', () => {
    it('should set editBoardColumn inProgress to true on editBoardColumn', () => {
      const action = BoardActions.editBoardColumn({
        payload: { columnId: '1', name: 'Updated Column', color: '#00FF00' },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.editBoardColumn.inProgress).toBe(true);
      expect(state.editBoardColumn.error).toBe(null);
      expect(state.editBoardColumn.success).toBe(false);
    });

    it('should update a board column and set editBoardColumn success to true on editBoardColumnSuccess', () => {
      const editedBoardColumn = {
        id: '1',
        name: 'Updated Column',
        color: '#00FF00',
        items: [],
      };
      const action = BoardActions.editBoardColumnSuccess({
        payload: {
          editedBoardColumn,
        } as unknown as EditBoardColumnSuccessPayload,
      });
      const initialStateWithColumn = {
        ...initialBoardState,
        entities: {
          '1': { id: '1', name: 'Initial Column', color: '#000000', items: [] },
        } as unknown as Dictionary<BoardColumn>,
        ids: ['1'],
      };
      const state = boardReducer(initialStateWithColumn, action);

      expect(state.entities[editedBoardColumn.id]).toEqual(
        expect.objectContaining(editedBoardColumn)
      );
      expect(state.editBoardColumn.inProgress).toBe(false);
      expect(state.editBoardColumn.success).toBe(true);
    });

    it('should update state with error information on editBoardColumnFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to edit column' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = BoardActions.editBoardColumnFail({
        payload: errorResponse,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.editBoardColumn.error).toBe('Failed to edit column');
      expect(state.editBoardColumn.inProgress).toBe(false);
      expect(state.editBoardColumn.success).toBe(false);
    });
  });

  describe('duplicateBoardColumn actions', () => {
    it('should set duplicateBoardColumn inProgress to true on duplicateBoardColumn', () => {
      const action = BoardActions.duplicateBoardColumn({
        payload: { columnId: '1', items: [] },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.duplicateBoardColumn.inProgress).toBe(true);
      expect(state.duplicateBoardColumn.error).toBe(null);
    });

    it('should add a duplicated board column on duplicateBoardColumnSuccess', () => {
      const duplicatedBoardColumn = {
        id: '2',
        name: 'Duplicated Column',
        items: [],
        color: '#FF0000',
      } as unknown as BoardColumn;
      const action = BoardActions.duplicateBoardColumnSuccess({
        payload: { duplicatedBoardColumn },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.entities[duplicatedBoardColumn.id]).toEqual(
        expect.objectContaining(duplicatedBoardColumn)
      );
      expect(state.duplicateBoardColumn.inProgress).toBe(false);
      expect(state.duplicateBoardColumn.error).toBe(null);
    });

    it('should update state with error information on duplicateBoardColumnFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to duplicate column' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = BoardActions.duplicateBoardColumnFail({
        payload: errorResponse,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.duplicateBoardColumn.error).toBe(
        'Failed to duplicate column'
      );
      expect(state.duplicateBoardColumn.inProgress).toBe(false);
    });
  });

  describe('removeBoardColumn actions', () => {
    it('should set removeBoardColumn inProgress to true on removeBoardColumn', () => {
      const action = BoardActions.removeBoardColumn({
        payload: { columnId: '1' },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.removeBoardColumn.inProgress).toBe(true);
      expect(state.removeBoardColumn.error).toBe(null);
    });

    it('should remove the board column on removeBoardColumnSuccess', () => {
      const removedBoardColumn = { id: '1' } as unknown as BoardColumn;
      const action = BoardActions.removeBoardColumnSuccess({
        payload: { removedBoardColumn },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.entities[removedBoardColumn.id]).toBeUndefined();
      expect(state.removeBoardColumn.inProgress).toBe(false);
      expect(state.removeBoardColumn.error).toBe(null);
    });

    it('should update state with error information on removeBoardColumnFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to remove column' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = BoardActions.removeBoardColumnFail({
        payload: errorResponse,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.removeBoardColumn.error).toBe('Failed to remove column');
      expect(state.removeBoardColumn.inProgress).toBe(false);
    });
  });

  describe('updateBoardColumns actions', () => {
    it('should set updateBoardColumns inProgress to true on updateBoardColumns', () => {
      const action = BoardActions.updateBoardColumns({
        payload: { columnsToUpdate: [], removedItemIds: [] },
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.updateBoardColumns.inProgress).toBe(true);
      expect(state.updateBoardColumns.error).toBe(null);
    });

    it('should update board column order and items on updateBoardColumnsSuccess', () => {
      const updatedColumns = [
        {
          id: '1',
          order: 1,
          items: [{ id: 'item1', content: 'Updated Item' }],
        },
      ] as unknown as BoardColumn[];
      const action = BoardActions.updateBoardColumnsSuccess({
        payload: { updatedColumns },
      });
      const initialStateWithColumns = {
        ...initialBoardState,
        entities: {
          '1': {
            id: '1',
            name: 'Column 1',
            color: '#FF0000',
            items: [],
            order: 2,
          },
        } as unknown as Dictionary<BoardColumn>,
        ids: ['1'],
      };
      const state = boardReducer(initialStateWithColumns, action);

      expect(state.entities['1']!.order).toEqual(updatedColumns[0].order);
      expect(state.entities['1']!.items).toEqual(updatedColumns[0].items);
      expect(state.updateBoardColumns.inProgress).toBe(false);
      expect(state.updateBoardColumns.error).toBe(null);
      expect(state.updateBoardColumns.success).toBe(true);
    });

    it('should update state with error information on updateBoardColumnsFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to update columns' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = BoardActions.updateBoardColumnsFail({
        payload: errorResponse,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.updateBoardColumns.error).toBe('Failed to update columns');
      expect(state.updateBoardColumns.inProgress).toBe(false);
    });
  });
});
