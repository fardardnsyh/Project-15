import '@angular/compiler';
import { Dictionary } from '@ngrx/entity';

import * as BoardSelectors from './board.selectors';

import { BoardColumn } from '@jhh/shared/domain';

const mockBoardInitialState = {
  board: {
    ids: ['1', '2'],
    entities: {
      '1': {
        id: '1',
        name: 'Column 1',
        items: [],
        color: '#FF0000',
        order: 1,
      },
      '2': {
        id: '2',
        name: 'Column 2',
        items: [],
        color: '#00FF00',
        order: 2,
      },
    } as unknown as Dictionary<BoardColumn>,
    addBoardColumn: { inProgress: false, error: 'Error', success: true },
    editBoardColumn: { inProgress: true, error: null, success: false },
    duplicateBoardColumn: { inProgress: false, error: 'Error' },
    removeBoardColumn: { inProgress: false, error: 'Error' },
    updateBoardColumns: { inProgress: false, error: 'Error', success: true },
  },
};

describe('Board Selectors', () => {
  it('should select the addBoardColumn inProgress state', () => {
    const result = BoardSelectors.selectAddBoardColumnInProgress.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(false);
  });

  it('should select the addBoardColumn error state', () => {
    const result = BoardSelectors.selectAddBoardColumnError.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe('Error');
  });

  it('should select the addBoardColumn success state', () => {
    const result = BoardSelectors.selectAddBoardColumnSuccess.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(true);
  });

  it('should select the editBoardColumn inProgress state', () => {
    const result = BoardSelectors.selectEditBoardColumnInProgress.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(true);
  });

  it('should select the editBoardColumn error state', () => {
    const result = BoardSelectors.selectEditBoardColumnError.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(null);
  });

  it('should select the editBoardColumn success state', () => {
    const result = BoardSelectors.selectEditBoardColumnSuccess.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(false);
  });

  it('should select the removeBoardColumn inProgress state', () => {
    const result = BoardSelectors.selectRemoveBoardColumnInProgress.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(false);
  });

  it('should select the removeBoardColumn error state', () => {
    const result = BoardSelectors.selectRemoveBoardColumnError.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe('Error');
  });

  it('should select the duplicateBoardColumn inProgress state', () => {
    const result =
      BoardSelectors.selectDuplicateBoardColumnInProgress.projector(
        mockBoardInitialState.board
      );
    expect(result).toBe(false);
  });

  it('should select the duplicateBoardColumn error state', () => {
    const result = BoardSelectors.selectDuplicateBoardColumnError.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe('Error');
  });

  it('should select the updateBoardColumns inProgress state', () => {
    const result = BoardSelectors.selectUpdateBoardColumnsInProgress.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(false);
  });

  it('should select the updateBoardColumns error state', () => {
    const result = BoardSelectors.selectUpdateBoardColumnsError.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe('Error');
  });

  it('should select the updateBoardColumns success state', () => {
    const result = BoardSelectors.selectUpdateBoardColumnsSuccess.projector(
      mockBoardInitialState.board
    );
    expect(result).toBe(true);
  });

  it('should select a limited number of board columns', () => {
    const props = { length: 1 };
    const result = BoardSelectors.selectLimitedColumns.projector(
      Object.values(mockBoardInitialState.board.entities) as BoardColumn[],
      props
    );
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Column 1');
  });
});
