import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { NotesEffects } from './notes.effects';
import * as NotesActions from './notes.actions';
import { NotesService } from '../services/notes.service';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import {
  AddNotesGroupSuccessPayload,
  ChangeNoteGroupPayload,
  ChangeNoteGroupSuccessPayload,
  DuplicateNotesGroupPayload,
  DuplicateNotesGroupSuccessPayload,
  EditNotesGroupPayload,
  EditNotesGroupSuccessPayload,
} from '@jhh/jhh-client/dashboard/notes/domain';

describe('NotesEffects', () => {
  let effects: NotesEffects;
  let actions$: Observable<any>;
  let notesService: jest.Mocked<NotesService>;
  let snackbarService: jest.Mocked<SnackbarService>;
  let removeNoteDialogService: jest.Mocked<RemoveNoteDialogService>;
  let changeNoteGroupDialogService: jest.Mocked<ChangeNoteGroupDialogService>;
  let editNotesGroupDialogService: jest.Mocked<EditNotesGroupDialogService>;
  let mockSnackbarRef: Partial<MatSnackBarRef<TextOnlySnackBar>>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    const mockNotesService = {
      addNotesGroup: jest.fn(),
      editNotesGroup: jest.fn(),
      duplicateNotesGroup: jest.fn(),
      changeNoteGroup: jest.fn(),
      removeNote: jest.fn(),
    };

    const mockChangeNoteGroupDialogService = {
      clearNoteToMove: jest.fn(),
    };

    const mockRemoveNoteDialogService = {
      clearNoteToRemove: jest.fn(),
    };

    const mockEditNoteDialogService = {
      clearNoteToEdit: jest.fn(),
    };

    mockSnackbarRef = {
      dismiss: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotesEffects,
        provideMockActions(() => actions$),
        { provide: NotesService, useValue: mockNotesService },
        {
          provide: SnackbarService,
          useValue: { open: jest.fn(), openIndefinite: jest.fn() },
        },
        {
          provide: EditNotesGroupDialogService,
          useValue: { clearNotesGroupToEdit: jest.fn() },
        },
        {
          provide: ChangeNoteGroupDialogService,
          useValue: mockChangeNoteGroupDialogService,
        },
        {
          provide: RemoveNoteDialogService,
          useValue: mockRemoveNoteDialogService,
        },
        { provide: EditNoteDialogService, useValue: mockEditNoteDialogService },
      ],
    });

    effects = TestBed.inject(NotesEffects);
    notesService = TestBed.inject(NotesService) as jest.Mocked<NotesService>;
    snackbarService = TestBed.inject(
      SnackbarService
    ) as jest.Mocked<SnackbarService>;
    editNotesGroupDialogService = TestBed.inject(
      EditNotesGroupDialogService
    ) as jest.Mocked<EditNotesGroupDialogService>;
    changeNoteGroupDialogService = TestBed.inject(
      ChangeNoteGroupDialogService
    ) as jest.Mocked<ChangeNoteGroupDialogService>;
    actions$ = new Observable();
  });

  it('should dispatch addNotesGroupSuccess and resetAddNotesGroupSuccess actions and open a snackbar on success', (done) => {
    const addNotesGroupPayload = { name: 'New Group' };
    const addNotesGroupSuccessPayload = {
      id: '123',
      name: 'New Group',
    } as unknown as AddNotesGroupSuccessPayload;
    notesService.addNotesGroup.mockReturnValue(of(addNotesGroupSuccessPayload));

    actions$ = of(
      NotesActions.addNotesGroup({ payload: addNotesGroupPayload })
    );

    effects.addNotesGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.addNotesGroupSuccess({
          payload: addNotesGroupSuccessPayload,
        })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Group added successfully!'
      );
      done();
    });
  });

  it('should dispatch editNotesGroupSuccess and resetEditNotesGroupSuccess actions, clear dialog, and open a snackbar on success', (done) => {
    const editNotesGroupPayload = {
      id: '123',
      name: 'Updated Group',
    } as unknown as EditNotesGroupPayload;
    const editNotesGroupSuccessPayload = {
      id: '123',
      name: 'Updated Group',
    } as unknown as EditNotesGroupSuccessPayload;
    notesService.editNotesGroup.mockReturnValue(
      of(editNotesGroupSuccessPayload)
    );

    actions$ = of(
      NotesActions.editNotesGroup({ payload: editNotesGroupPayload })
    );

    effects.editNotesGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.editNotesGroupSuccess({
          payload: editNotesGroupSuccessPayload,
        })
      );
      expect(
        editNotesGroupDialogService.clearNotesGroupToEdit
      ).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Group edited successfully!'
      );
      done();
    });
  });

  it('should show an indefinite snackbar, dispatch duplicateNotesGroupSuccess and resetDuplicateNotesGroupSuccess actions, and then show a success snackbar on completion', (done) => {
    const duplicateNotesGroupPayload = {
      id: '123',
    } as unknown as DuplicateNotesGroupPayload;
    const duplicateNotesGroupSuccessPayload = {
      id: '456',
      name: 'Duplicated Group',
    } as unknown as DuplicateNotesGroupSuccessPayload;
    notesService.duplicateNotesGroup.mockReturnValue(
      of(duplicateNotesGroupSuccessPayload)
    );
    snackbarService.openIndefinite.mockReturnValue(
      mockSnackbarRef as MatSnackBarRef<TextOnlySnackBar>
    );

    actions$ = of(
      NotesActions.duplicateNotesGroup({
        payload: duplicateNotesGroupPayload,
      })
    );

    effects.duplicateNotesGroup$.subscribe((action) => {
      expect(snackbarService.openIndefinite).toHaveBeenCalledWith(
        'Duplicating group...'
      );
      expect(action).toEqual(
        NotesActions.duplicateNotesGroupSuccess({
          payload: duplicateNotesGroupSuccessPayload,
        })
      );
      expect(mockSnackbarRef.dismiss).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Group duplicated successfully!'
      );
      done();
    });
  });

  it('should dispatch changeNoteGroupSuccess and resetChangeNoteGroupSuccess actions, clear dialog, and open a snackbar on success', (done) => {
    const changeNoteGroupPayload = {
      noteId: 'note123',
      newGroupId: 'group456',
    } as unknown as ChangeNoteGroupPayload;
    const changeNoteGroupSuccessPayload = {
      noteId: 'note123',
      groupId: 'group456',
    } as unknown as ChangeNoteGroupSuccessPayload;
    notesService.changeNoteGroup.mockReturnValue(
      of(changeNoteGroupSuccessPayload)
    );

    actions$ = of(
      NotesActions.changeNoteGroup({ payload: changeNoteGroupPayload })
    );

    effects.changeNoteGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.changeNoteGroupSuccess({
          payload: changeNoteGroupSuccessPayload,
        })
      );
      expect(changeNoteGroupDialogService.clearNoteToMove).toHaveBeenCalled();
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Note successfully moved to another group!'
      );
      done();
    });
  });

  it('should handle changeNoteGroup success', (done) => {
    const payload = {
      noteId: 'note1',
      newGroupId: 'group1',
    } as unknown as ChangeNoteGroupPayload;
    const successPayload = {
      noteId: 'note1',
      groupId: 'group1',
    } as unknown as ChangeNoteGroupSuccessPayload;
    notesService.changeNoteGroup.mockReturnValue(of(successPayload));
    actions$ = of(NotesActions.changeNoteGroup({ payload }));

    effects.changeNoteGroup$.subscribe((action) => {
      expect(action).toEqual(
        NotesActions.changeNoteGroupSuccess({ payload: successPayload })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Note successfully moved to another group!'
      );
      done();
    });
  });
});
