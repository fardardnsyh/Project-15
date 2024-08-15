import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { AddGroupComponent } from './add-group.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroupFormField } from '@jhh/jhh-client/dashboard/notes/domain';

describe('AddGroupComponent', () => {
  let component: AddGroupComponent;
  let fixture: ComponentFixture<AddGroupComponent>;
  let mockDialog: jest.Mocked<MatDialog>, mockNotesFacade: Partial<NotesFacade>;

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
      addNotesGroupInProgress$: of(false),
      addNotesGroupError$: of(null),
      addNotesGroupSuccess$: of(false),
      addNotesGroup: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, AddGroupComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: mockDialog },
        { provide: NotesFacade, useValue: mockNotesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group correctly', () => {
    expect(component.formGroup.get(NotesGroupFormField.Name)).toBeTruthy();
    expect(
      component.formGroup.get(NotesGroupFormField.Name)?.validator
    ).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.formGroup.valid).toBeFalsy();
  });

  it('should display spinner when addNotesGroupInProgress$ emits true', (done) => {
    mockNotesFacade.addNotesGroupInProgress$ = of(true);
    component.ngOnInit();
    component.addNotesGroupInProgress$.subscribe((isInProgress) => {
      expect(isInProgress).toBe(true);
      done();
    });
  });

  it('should display error message when addNotesGroupError$ emits value', (done) => {
    const errorMessage = 'Error occurred';
    mockNotesFacade.addNotesGroupError$ = of(errorMessage);
    component.ngOnInit();
    component.addNotesGroupError$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
