import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ColumnsComponent } from './columns.component';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

import { BoardColumn } from '@jhh/shared/domain';

describe('ColumnsComponent', () => {
  let component: ColumnsComponent;
  let fixture: ComponentFixture<ColumnsComponent>;
  let mockBoardFacade: jest.Mocked<Partial<BoardFacade>>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockBoardFacade = {
      editBoardColumnSuccess$: of(false),
      updateBoardColumnsInProgress$: of(false),
      updateBoardColumns: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ColumnsComponent, NoopAnimationsModule],
      providers: [{ provide: BoardFacade, useValue: mockBoardFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnsComponent);
    component = fixture.componentInstance;
    component.isSaving$ = new BehaviorSubject<boolean>(false);
    component.wasUpdateTriggeredByColumnsComponent$ =
      new BehaviorSubject<boolean>(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component with correct initial values', () => {
    TestBed.runInInjectionContext(() => {
      const columnsComponent = new ColumnsComponent();
      columnsComponent.isSaving$ = new BehaviorSubject<boolean>(false);
      columnsComponent.wasUpdateTriggeredByColumnsComponent$ =
        new BehaviorSubject<boolean>(false);

      columnsComponent.ngOnInit();

      expect(columnsComponent.isSaving$).toBeInstanceOf(BehaviorSubject);
      expect(columnsComponent.isSaving$.getValue()).toBe(false);
      expect(
        columnsComponent.wasUpdateTriggeredByColumnsComponent$
      ).toBeInstanceOf(BehaviorSubject);
      expect(
        columnsComponent.wasUpdateTriggeredByColumnsComponent$.getValue()
      ).toBe(false);
      expect(columnsComponent._columns).toEqual([]);
      expect(columnsComponent.editingItem).toEqual({});
      expect(columnsComponent.editableContent).toEqual({});

      columnsComponent.ngOnDestroy();
    });
  });

  it('should add an item to a column', () => {
    const columnId = 'testColumnId';
    component.columns = [
      {
        id: columnId,
        name: 'Test Column',
        items: [],
        color: '#FF0000',
        order: 1,
      },
    ] as unknown as BoardColumn[];
    fixture.detectChanges();

    component.addItem(columnId);

    expect(
      component._columns.find((column) => column.id === columnId)!.items.length
    ).toBe(1);
  });

  it('should start editing an item and update its content', () => {
    TestBed.runInInjectionContext(() => {
      const columnsComponent = new ColumnsComponent();

      const itemId = 'item1';
      const content = 'Item 1';
      columnsComponent.editingItem = {};
      columnsComponent.editableContent = {};

      columnsComponent.startEdit(itemId, content);

      expect(columnsComponent.editingItem[itemId]).toBe(true);
      expect(columnsComponent.editableContent[itemId]).toBe(content);

      columnsComponent.ngOnDestroy();
    });
  });

  it('should remove an item from a column', () => {
    const testColumnId = '1337';
    const testItemId = 'temp-123';

    component.columns = [
      {
        id: testColumnId,
        name: 'Test Column',
        items: [{ id: testItemId }],
        color: '#FF0000',
        order: 1,
      },
    ] as BoardColumn[];
    fixture.detectChanges();
    component.removeItem(testColumnId, testItemId);

    expect(
      component._columns
        .find((column) => column.id === testColumnId)!
        .items.some((item) => item.id === testItemId)
    ).toBe(false);
  });

  it('should reorder items within a column after drag and drop', () => {
    component._columns = [
      {
        id: '1',
        order: 0,
        name: 'Column 1',
        color: 'red',
        items: [
          { id: 'item1', order: 0, content: 'Item 1' },
          { id: 'item2', order: 1, content: 'Item 2' },
          { id: 'item3', order: 2, content: 'Item 3' },
        ],
      },
    ] as unknown as BoardColumn[];

    const column = component._columns.find((col) => col.id === '1');
    if (!column) throw new Error('Column not found');

    const startOrder = column.items.map((item) => item.id);
    const [removed] = startOrder.splice(2, 1);
    startOrder.splice(0, 0, removed);

    column.items = startOrder.map(
      (id) => column.items.find((item) => item.id === id)!
    );

    const newOrder = column.items.map((item) => item.id);
    expect(newOrder).toEqual(['item3', 'item1', 'item2']);
  });

  it('should reorder columns after drag and drop', () => {
    component._columns = [
      { id: '1', order: 0, items: [], name: 'Column 1', color: 'red' },
      { id: '2', order: 1, items: [], name: 'Column 2', color: 'blue' },
      { id: '3', order: 2, items: [], name: 'Column 3', color: 'green' },
    ] as unknown as BoardColumn[];

    const startOrder = component._columns.map((column) => column.id);

    const [removed] = startOrder.splice(2, 1);
    startOrder.splice(1, 0, removed);

    component._columns = startOrder.map(
      (id) => component._columns.find((column) => column.id === id)!
    );

    const newOrder = component._columns.map((column) => column.id);
    expect(newOrder).toEqual(['1', '3', '2']);
  });
});
