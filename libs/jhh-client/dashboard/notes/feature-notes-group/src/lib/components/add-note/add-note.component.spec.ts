import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AddNoteComponent } from './add-note.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

describe('AddNoteComponent', () => {
  let component: AddNoteComponent;
  let fixture: ComponentFixture<AddNoteComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockNotesFacade: Partial<NotesFacade>;

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
    mockNotesFacade = {
      addNoteInProgress$: of(false),
      addNoteError$: of(null),
      addNoteSuccess$: of(false),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddNoteComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: NotesFacade, useValue: mockNotesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNoteComponent);
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
      component.formGroup.controls[component.formField.Content]
    ).toBeDefined();
  });

  it('form should be invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should display spinner when addNoteInProgress$ emits true', (done) => {
    mockNotesFacade.addNoteInProgress$ = of(true);
    component.ngOnInit();
    component.addNoteInProgress$.subscribe((isInProgress) => {
      expect(isInProgress).toBe(true);
      done();
    });
  });

  it('should display error message when addNoteError$ emits value', (done) => {
    const errorMessage = 'Error occurred';
    mockNotesFacade.addNoteError$ = of(errorMessage);
    component.ngOnInit();
    component.addNoteError$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
