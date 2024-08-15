import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import * as BoardActions from './board.actions';
import { Actions } from '@ngrx/effects';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import { BoardFacade } from './board.facade';
import { BoardColumnItem } from '@jhh/shared/domain';

describe('BoardFacade', () => {
  let store: MockStore;
  let facade: BoardFacade;
  let actions$: Observable<Actions>;
  let mockActionResolverService: Partial<ActionResolverService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    mockActionResolverService = {
      executeAndWatch: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BoardFacade,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    facade = TestBed.inject(BoardFacade);
  });

  it('should execute and watch addBoardColumn action', () => {
    const payload = {
      name: 'New Column',
      color: '#FFFFFF',
    };
    facade.addBoardColumn(payload.name, payload.color);

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      BoardActions.addBoardColumn({ payload }),
      BoardActions.Type.AddBoardColumnSuccess,
      BoardActions.Type.AddBoardColumnFail
    );
  });

  it('should execute and watch editBoardColumn action', () => {
    const payload = {
      columnId: '123',
      name: 'Updated Column',
      color: '#000000',
    };
    facade.editBoardColumn(payload.columnId, payload.name, payload.color);

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      BoardActions.editBoardColumn({ payload }),
      BoardActions.Type.EditBoardColumnSuccess,
      BoardActions.Type.EditBoardColumnFail
    );
  });

  it('should execute and watch duplicateBoardColumn action', () => {
    const payload = {
      columnId: '123',
      items: [
        { content: 'Task 1' },
        { content: 'Task 2' },
      ] as BoardColumnItem[],
    };
    facade.duplicateBoardColumn(payload.columnId, payload.items);

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      BoardActions.duplicateBoardColumn({ payload }),
      BoardActions.Type.DuplicateBoardColumnSuccess,
      BoardActions.Type.DuplicateBoardColumnFail
    );
  });

  it('should execute and watch updateBoardColumns action', () => {
    const payload = {
      columnsToUpdate: [{ id: '123', name: 'Column 1' }],
      removedItemIds: ['item1', 'item2'],
      unsavedBoardRequestId: 'unsaved123',
    };
    facade.updateBoardColumns(
      payload.columnsToUpdate,
      payload.removedItemIds,
      payload.unsavedBoardRequestId
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      BoardActions.updateBoardColumns({ payload }),
      BoardActions.Type.UpdateBoardColumnsSuccess,
      BoardActions.Type.UpdateBoardColumnsFail
    );
  });

  it('should dispatch resetErrors action', () => {
    facade.resetErrors();
    expect(store.dispatch).toHaveBeenCalledWith(BoardActions.resetErrors());
  });
});
