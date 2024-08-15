import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { BoardColumnsService } from './board-columns.service';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

import { BoardColumn, BoardColumnItem } from '@jhh/shared/domain';

describe('BoardColumnsService', () => {
  let service: BoardColumnsService;
  let mockActionResolverService: { executeAndWatch: jest.Mock<any, any, any> };

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
        provideMockStore(),
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    });
    service = TestBed.inject(BoardColumnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should move an item from one column to another', () => {
    const columns: BoardColumn[] = [
      {
        id: '1',
        items: [{ id: 'item1', content: 'Test Item', order: 0 }],
        name: 'Column 1',
        color: 'red',
        order: 0,
      },
      { id: '2', items: [], name: 'Column 2', color: 'blue', order: 1 },
    ] as unknown as BoardColumn[];
    const event = {
      previousContainer: { id: 'drop-list-1' },
      container: { id: 'drop-list-2' },
      previousIndex: 0,
      currentIndex: 0,
    } as CdkDragDrop<BoardColumnItem[], any>;

    const result = service.dropItem(columns, event);
    expect(result[0].items.length).toEqual(0);
    expect(result[1].items.length).toEqual(1);
    expect(result[1].items[0].id).toEqual('item1');
  });

  it('should add a new item to a specific column', () => {
    const columns: BoardColumn[] = [
      { id: '1', items: [], name: 'Column 1', color: 'red', order: 0 },
    ] as unknown as BoardColumn[];
    const columnId = '1';
    const editableContent = {};
    const editingItem: {
      [key: string]: boolean;
    } = {};

    const result = service.addItem(
      columns,
      columnId,
      editableContent,
      editingItem
    );
    expect(result[0].items.length).toEqual(1);
    expect(editingItem[result[0].items[0].id]).toBe(true);
  });

  it('should remove an item from a column', () => {
    const columns: BoardColumn[] = [
      {
        id: '1',
        items: [{ id: 'item1', content: 'Test Content', order: 0 }],
        name: 'Column 1',
        color: 'red',
        order: 0,
      },
    ] as unknown as BoardColumn[];
    const columnId = '1';
    const itemId = 'item1';
    const removedItemIds: string[] = [];

    const result = service.removeItem(
      columns,
      columnId,
      itemId,
      removedItemIds
    );
    expect(result[0].items.length).toBe(0);
    expect(removedItemIds.includes(itemId)).toBe(true);
  });

  it('should merge data correctly', () => {
    const currentColumns: BoardColumn[] = [
      { id: '1', name: 'Column 1', items: [], color: 'blue', order: 1 },
    ] as unknown as BoardColumn[];
    const newData: BoardColumn[] = [
      {
        id: '1',
        name: 'Updated Column 1',
        items: [],
        color: 'green',
        order: 1,
      },
    ] as unknown as BoardColumn[];
    const wasUpdateTriggeredInternally = false;

    const result = service.mergeWithWorkingData(
      currentColumns,
      newData,
      wasUpdateTriggeredInternally
    );
    expect(result[0].name).toEqual('Updated Column 1');
    expect(result[0].color).toEqual('green');
  });
});
