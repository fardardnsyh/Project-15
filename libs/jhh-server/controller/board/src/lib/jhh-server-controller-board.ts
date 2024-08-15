import addBoardColumn from './add-board-column';
import editBoardColumn from './edit-board-column';
import duplicateBoardColumn from './duplicate-board-column';
import removeBoardColumn from './remove-board-column';
import updateBoardColumns from './update-board-columns';

export function JhhServerControllerBoard() {
  return {
    addBoardColumn,
    editBoardColumn,
    duplicateBoardColumn,
    removeBoardColumn,
    updateBoardColumns,
  };
}
