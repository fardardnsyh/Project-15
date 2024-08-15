import { BoardColumn, BoardColumnItem } from '@jhh/shared/domain';

interface DefaultColumnItem
  extends Pick<BoardColumnItem, 'content' | 'order'> {}

interface DefaultBoardColumn
  extends Pick<BoardColumn, 'name' | 'color' | 'order'> {
  items: DefaultColumnItem[];
}

const defaultBoardColumns: DefaultBoardColumn[] = [
  {
    name: 'Todo',
    color: '#e55039',
    order: 0,
    items: [
      { content: 'Shopping', order: 0 },
      { content: 'Pick up parcels', order: 1 },
      { content: 'Reply to e-mails', order: 2 },
      { content: 'Pay the bills', order: 3 },
      { content: 'Run', order: 4 },
      { content: 'Book holidays', order: 5 },
    ],
  },
  {
    name: 'Soon',
    color: '#9b59b6',
    order: 1,
    items: [],
  },
  {
    name: 'Done',
    color: '#6ab04c',
    order: 2,
    items: [
      { content: 'Vacuum the living room', order: 0 },
      { content: 'Water the plants', order: 1 },
    ],
  },
];

export default defaultBoardColumns;
