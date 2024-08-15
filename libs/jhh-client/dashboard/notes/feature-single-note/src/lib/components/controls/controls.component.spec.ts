import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { ControlsComponent } from './controls.component';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let routerMock: { navigate: jest.Mock };
  let notesFacadeMock: Partial<NotesFacade>;
  let editNoteDialogServiceMock: Partial<EditNoteDialogService>;
  let changeNoteGroupDialogServiceMock: Partial<ChangeNoteGroupDialogService>;
  let removeNoteDialogServiceMock: Partial<RemoveNoteDialogService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    notesFacadeMock = {
      editNoteSuccess$: of(false),
    };
    editNoteDialogServiceMock = { openDialog: jest.fn() };
    changeNoteGroupDialogServiceMock = { openDialog: jest.fn() };
    removeNoteDialogServiceMock = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ControlsComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: NotesFacade, useValue: notesFacadeMock },
        { provide: EditNoteDialogService, useValue: editNoteDialogServiceMock },
        {
          provide: ChangeNoteGroupDialogService,
          useValue: changeNoteGroupDialogServiceMock,
        },
        {
          provide: RemoveNoteDialogService,
          useValue: removeNoteDialogServiceMock,
        },
      ],
    }).compileComponents();

    component = TestBed.createComponent(ControlsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog on editNoteDialogService when openEditNoteDialog is called', () => {
    component.openEditNoteDialog();
    expect(editNoteDialogServiceMock.openDialog).toHaveBeenCalledWith(
      component.note
    );
  });

  it('should call openDialog on changeNoteGroupDialogService when openChangeNoteGroupDialog is called', () => {
    component.openChangeNoteGroupDialog();
    expect(changeNoteGroupDialogServiceMock.openDialog).toHaveBeenCalledWith(
      component.note
    );
  });

  it('should call openDialog on removeNoteDialogService when openRemoveNoteDialog is called', () => {
    component.openRemoveNoteDialog();
    expect(removeNoteDialogServiceMock.openDialog).toHaveBeenCalledWith(
      component.note
    );
  });
});
