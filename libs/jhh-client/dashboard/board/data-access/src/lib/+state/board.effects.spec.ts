import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import * as BoardActions from './board.actions';
import { BoardEffects } from './board.effects';
import { BoardService } from '../services/board.service';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import {
  AddBoardColumnPayload,
  AddBoardColumnSuccessPayload,
  DuplicateBoardColumnPayload,
  DuplicateBoardColumnSuccessPayload,
  EditBoardColumnPayload,
  EditBoardColumnSuccessPayload,
  RemoveBoardColumnPayload,
  RemoveBoardColumnSuccessPayload,
  UpdateBoardColumnsPayload,
  UpdateBoardColumnsSuccessPayload,
} from '@jhh/jhh-client/dashboard/board/domain';
import { HttpErrorResponse } from '@angular/common/http';

describe('BoardEffects', () => {
  let actions$: Observable<Action>;
  let effects: BoardEffects;
  let boardService: jest.Mocked<BoardService>;
  let snackbarService: jest.Mocked<SnackbarService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    boardService = {
      addBoardColumn: jest.fn(),
      editBoardColumn: jest.fn(),
      duplicateBoardColumn: jest.fn(),
      removeBoardColumn: jest.fn(),
      updateBoardColumns: jest.fn(),
    } as unknown as jest.Mocked<BoardService>;

    snackbarService = {
      open: jest.fn(),
      openIndefinite: jest.fn(() => ({
        dismiss: jest.fn(),
      })),
    } as unknown as jest.Mocked<SnackbarService>;

    TestBed.configureTestingModule({
      providers: [
        BoardEffects,
        provideMockActions(() => actions$),
        { provide: BoardService, useValue: boardService },
        { provide: SnackbarService, useValue: snackbarService },
      ],
    });

    effects = TestBed.inject(BoardEffects);
  });

  describe('addBoardColumn$', () => {
    it('should dispatch addBoardColumnSuccess and resetAddBoardColumnSuccess actions on successful addition', () => {
      const columnPayload = {
        name: 'New Column',
      } as unknown as AddBoardColumnPayload;
      const successPayload = {
        id: '123',
        name: 'New Column',
      } as unknown as AddBoardColumnSuccessPayload;

      boardService.addBoardColumn.mockReturnValue(of(successPayload));
      actions$ = of(
        BoardActions.addBoardColumn({
          payload: columnPayload as AddBoardColumnPayload,
        })
      );

      effects.addBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.addBoardColumnSuccess({
            payload: successPayload as unknown as AddBoardColumnSuccessPayload,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'New column added successfully!'
        );
      });
    });

    it('should dispatch addBoardColumnFail action on failure', () => {
      const columnPayload = { name: 'New Column' };
      const error = new Error('Failed to add column');

      boardService.addBoardColumn.mockReturnValue(throwError(() => error));
      actions$ = of(
        BoardActions.addBoardColumn({
          payload: columnPayload as AddBoardColumnPayload,
        })
      );

      effects.addBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.addBoardColumnFail({
            payload: error as HttpErrorResponse,
          })
        );
      });
    });
  });

  describe('editBoardColumn$', () => {
    it('should dispatch editBoardColumnSuccess and resetEditBoardColumnSuccess actions on successful edit', () => {
      const columnPayload = {
        id: '123',
        name: 'Updated Column',
      } as unknown as EditBoardColumnPayload;
      const successPayload = {
        id: '123',
        name: 'Updated Column',
      } as unknown as EditBoardColumnSuccessPayload;

      boardService.editBoardColumn.mockReturnValue(of(successPayload));
      actions$ = of(
        BoardActions.editBoardColumn({
          payload: columnPayload as unknown as EditBoardColumnPayload,
        })
      );

      effects.editBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.editBoardColumnSuccess({
            payload: successPayload as unknown as EditBoardColumnSuccessPayload,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Column edited successfully!'
        );
      });
    });

    it('should dispatch editBoardColumnFail action on failure', () => {
      const columnPayload = { id: '123', name: 'Updated Column' };
      const error = new Error('Failed to edit column');

      boardService.editBoardColumn.mockReturnValue(throwError(() => error));
      actions$ = of(
        BoardActions.editBoardColumn({
          payload: columnPayload as unknown as EditBoardColumnPayload,
        })
      );

      effects.editBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.editBoardColumnFail({
            payload: error as HttpErrorResponse,
          })
        );
      });
    });
  });

  describe('duplicateBoardColumn$', () => {
    it('should dispatch duplicateBoardColumnSuccess and resetDuplicateBoardColumnSuccess actions on successful duplication', () => {
      const columnId = '123';
      const successPayload = {
        id: '456',
        name: 'Duplicated Column',
      } as unknown as DuplicateBoardColumnSuccessPayload;

      boardService.duplicateBoardColumn.mockReturnValue(of(successPayload));
      actions$ = of(
        BoardActions.duplicateBoardColumn({
          payload: { id: columnId } as unknown as DuplicateBoardColumnPayload,
        })
      );

      effects.duplicateBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.duplicateBoardColumnSuccess({
            payload:
              successPayload as unknown as DuplicateBoardColumnSuccessPayload,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Column duplicated successfully!'
        );
      });
    });

    it('should dispatch duplicateBoardColumnFail action on failure', () => {
      const columnId = '123';
      const error = new Error('Failed to duplicate column');

      boardService.duplicateBoardColumn.mockReturnValue(
        throwError(() => error)
      );
      actions$ = of(
        BoardActions.duplicateBoardColumn({
          payload: { id: columnId } as unknown as DuplicateBoardColumnPayload,
        })
      );

      effects.duplicateBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.duplicateBoardColumnFail({
            payload: error as HttpErrorResponse,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Something went wrong when duplicating an board column. Try it again'
        );
      });
    });
  });

  describe('removeBoardColumn$', () => {
    it('should dispatch removeBoardColumnSuccess and resetRemoveBoardColumnSuccess actions on successful removal', () => {
      const columnId = '123';
      const successPayload = {
        id: columnId,
      } as unknown as RemoveBoardColumnSuccessPayload;

      boardService.removeBoardColumn.mockReturnValue(of(successPayload));
      actions$ = of(
        BoardActions.removeBoardColumn({
          payload: { id: columnId } as unknown as RemoveBoardColumnPayload,
        })
      );

      effects.removeBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.removeBoardColumnSuccess({
            payload:
              successPayload as unknown as RemoveBoardColumnSuccessPayload,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Column removed successfully!'
        );
      });
    });

    it('should dispatch removeBoardColumnFail action on failure', () => {
      const columnId = '123';
      const error = new Error('Failed to remove column');

      boardService.removeBoardColumn.mockReturnValue(throwError(() => error));
      actions$ = of(
        BoardActions.removeBoardColumn({
          payload: { id: columnId } as unknown as RemoveBoardColumnPayload,
        })
      );

      effects.removeBoardColumn$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.removeBoardColumnFail({
            payload: error as HttpErrorResponse,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Something went wrong when removing the board column. Try it again'
        );
      });
    });
  });

  describe('updateBoardColumns$', () => {
    it('should dispatch updateBoardColumnsSuccess and resetUpdateBoardColumnsSuccess actions on successful update', () => {
      const updatePayload = {
        columns: [{ id: '123', name: 'Updated Column' }],
      };
      const successPayload =
        updatePayload as unknown as UpdateBoardColumnsSuccessPayload;

      boardService.updateBoardColumns.mockReturnValue(of(successPayload));
      actions$ = of(
        BoardActions.updateBoardColumns({
          payload: updatePayload as unknown as UpdateBoardColumnsPayload,
        })
      );

      effects.updateBoardColumns$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.updateBoardColumnsSuccess({
            payload:
              successPayload as unknown as UpdateBoardColumnsSuccessPayload,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Board changes saved successfully!'
        );
      });
    });

    it('should dispatch updateBoardColumnsFail action on failure', () => {
      const updatePayload = {
        columns: [{ id: '123', name: 'Updated Column' }],
      };
      const error = new Error('Failed to update board columns');

      boardService.updateBoardColumns.mockReturnValue(throwError(() => error));
      actions$ = of(
        BoardActions.updateBoardColumns({
          payload: updatePayload as unknown as UpdateBoardColumnsPayload,
        })
      );

      effects.updateBoardColumns$.subscribe((action) => {
        expect(action).toEqual(
          BoardActions.updateBoardColumnsFail({
            payload: error as HttpErrorResponse,
          })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Something went wrong when updating board data. Refresh and try again.'
        );
      });
    });
  });
});
