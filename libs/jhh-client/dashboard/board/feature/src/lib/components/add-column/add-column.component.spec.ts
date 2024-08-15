import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AddColumnComponent } from './add-column.component';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

describe('AddColumnComponent', () => {
  let component: AddColumnComponent;
  let fixture: ComponentFixture<AddColumnComponent>;
  let mockBoardFacade: Partial<BoardFacade>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<MatDialog>;

    mockBoardFacade = {
      addBoardColumnInProgress$: of(false),
      addBoardColumnError$: of(null),
      addBoardColumnSuccess$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [AddColumnComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: BoardFacade, useValue: mockBoardFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group correctly', () => {
    expect(component.formGroup).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Name]
    ).toBeDefined();
    expect(
      component.formGroup.controls[component.formField.Color]
    ).toBeDefined();
  });

  it('form should be invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should display spinner when addBoardColumnInProgress$ emits true', (done) => {
    mockBoardFacade.addBoardColumnInProgress$ = of(true);
    component.ngOnInit();
    component.addBoardColumnInProgress$.subscribe((isInProgress) => {
      expect(isInProgress).toBe(true);
      done();
    });
  });

  it('should display error message when addBoardColumnError$ emits value', (done) => {
    const errorMessage = 'Error occurred';
    mockBoardFacade.addBoardColumnError$ = of(errorMessage);
    component.ngOnInit();
    component.addBoardColumnError$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
