import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { ColumnMenuComponent } from './column-menu.component';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

import { BoardColumn } from '@jhh/shared/domain';

describe('ColumnMenuComponent', () => {
  let component: ColumnMenuComponent;
  let fixture: ComponentFixture<ColumnMenuComponent>;
  let mockBoardFacade: Partial<BoardFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockBoardFacade = {
      editBoardColumnSuccess$: of(false),
      duplicateBoardColumn: jest.fn(),
      removeBoardColumn: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ColumnMenuComponent],
      providers: [{ provide: BoardFacade, useValue: mockBoardFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnMenuComponent);
    component = fixture.componentInstance;
    component.column = {
      name: 'Todo',
      color: '#e55039',
      order: 0,
      items: [{ content: 'Get to work', order: 0 }],
    } as BoardColumn;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formGroup with column name and color when ngOnInit is called', () => {
    TestBed.runInInjectionContext(() => {
      const column: BoardColumn = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Column 1',
        color: '#3498db',
        order: 1,
        items: [],
      };

      const columnMenuComponent = new ColumnMenuComponent();
      columnMenuComponent.column = column;
      columnMenuComponent.ngOnInit();

      expect(
        columnMenuComponent.formGroup.get(columnMenuComponent.formField.Name)!
          .value
      ).toEqual(column.name);
      expect(
        columnMenuComponent.formGroup.get(columnMenuComponent.formField.Color)!
          .value
      ).toEqual(column.color);
    });
  });

  it('should handle invalid form submission when onSubmit is called with invalid formGroup', () => {
    TestBed.runInInjectionContext(() => {
      const column: BoardColumn = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Column 1',
        color: '#3498db',
        order: 1,
        items: [],
      };

      const columnMenuComponent = new ColumnMenuComponent();
      columnMenuComponent.column = column;
      columnMenuComponent.ngOnInit();

      columnMenuComponent.formGroup
        .get(columnMenuComponent.formField.Name)!
        .setValue('');
      columnMenuComponent.formGroup
        .get(columnMenuComponent.formField.Color)!
        .setValue('');

      columnMenuComponent.onSubmit();

      expect(columnMenuComponent['dialogRef']).toBeUndefined();
    });
  });

  it('should handle duplicate column when handleDuplicate is called', () => {
    TestBed.runInInjectionContext(() => {
      const column: BoardColumn = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Column 1',
        color: '#3498db',
        order: 1,
        items: [],
      };

      const boardFacadeMock = {
        duplicateBoardColumn: jest.fn(),
      };

      const columnMenuComponent = new ColumnMenuComponent();
      columnMenuComponent.column = column;
      // @ts-ignore
      columnMenuComponent['boardFacade'] = boardFacadeMock;

      columnMenuComponent.handleDuplicate();

      expect(boardFacadeMock.duplicateBoardColumn).toHaveBeenCalledWith(
        column.id,
        []
      );
    });
  });
});
