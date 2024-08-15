import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NotesFacade } from './notes.facade';
import * as NotesActions from './notes.actions';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { NotesService } from '../services/notes.service';

describe('NotesFacade', () => {
  let store: MockStore;
  let facade: NotesFacade;
  let mockNotesService: Partial<NotesService>;
  let actions$: Observable<any>;
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

    mockNotesService = {
      addNotesGroup: jest.fn(),
      editNotesGroup: jest.fn(),
      duplicateNotesGroup: jest.fn(),
      removeNotesGroup: jest.fn(),
      addNote: jest.fn(),
      editNote: jest.fn(),
      duplicateNote: jest.fn(),
      changeNoteGroup: jest.fn(),
      removeNote: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotesFacade,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: NotesService, useValue: mockNotesService },
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    facade = TestBed.inject(NotesFacade);
  });

  describe('NotesFacade', () => {
    it('should dispatch addNotesGroup', () => {
      const name = 'New Group';
      facade.addNotesGroup(name);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.addNotesGroup({ payload: { name } }),
        NotesActions.Type.AddNotesGroupSuccess,
        NotesActions.Type.AddNotesGroupFail
      );
    });

    it('should dispatch editNotesGroup action', () => {
      const groupId = '123';
      const name = 'Updated Group';
      const slug = 'updated-group';
      facade.editNotesGroup(groupId, name, slug);

      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.editNotesGroup({ payload: { groupId, name, slug } }),
        NotesActions.Type.EditNotesGroupSuccess,
        NotesActions.Type.EditNotesGroupFail
      );
    });

    it('should dispatch duplicateNotesGroup action', () => {
      const groupId = '123';
      facade.duplicateNotesGroup(groupId);

      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.duplicateNotesGroup({ payload: { groupId } }),
        NotesActions.Type.DuplicateNotesGroupSuccess,
        NotesActions.Type.DuplicateNotesGroupFail
      );
    });

    it('should dispatch removeNotesGroup action', () => {
      const groupId = '123';
      facade.removeNotesGroup(groupId);

      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.removeNotesGroup({ payload: { groupId } }),
        NotesActions.Type.RemoveNotesGroupSuccess,
        NotesActions.Type.RemoveNotesGroupFail
      );
    });

    it('should dispatch addNote action', () => {
      const name = 'New Note';
      const content = 'Note content';
      const groupId = 'test-group-id';
      facade.addNote(name, content, groupId);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.addNote({ payload: { name, content, groupId } }),
        NotesActions.Type.AddNoteSuccess,
        NotesActions.Type.AddNoteFail
      );
    });

    it('should dispatch editNote action', () => {
      const noteId = 'note123';
      const name = 'Updated Note';
      const content = 'Updated content';
      const slug = 'updated-note';
      const groupId = 'group123';
      facade.editNote(noteId, name, slug, content, groupId);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.editNote({
          payload: { noteId, name, slug, content, groupId },
        }),
        NotesActions.Type.EditNoteSuccess,
        NotesActions.Type.EditNoteFail
      );
    });

    it('should dispatch duplicateNote action', () => {
      const noteId = 'note123';
      const groupId = 'group123';
      facade.duplicateNote(noteId, groupId);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.duplicateNote({ payload: { noteId, groupId } }),
        NotesActions.Type.DuplicateNoteSuccess,
        NotesActions.Type.DuplicateNoteFail
      );
    });

    it('should dispatch changeNoteGroup action', () => {
      const noteId = 'note123';
      const newGroupId = 'new-group123';
      facade.changeNoteGroup(noteId, newGroupId);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.changeNoteGroup({ payload: { noteId, newGroupId } }),
        NotesActions.Type.ChangeNoteGroupSuccess,
        NotesActions.Type.ChangeNoteGroupFail
      );
    });

    it('should dispatch removeNote action', () => {
      const noteId = 'note123';
      facade.removeNote(noteId);
      expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
        NotesActions.removeNote({ payload: { noteId } }),
        NotesActions.Type.RemoveNoteSuccess,
        NotesActions.Type.RemoveNoteFail
      );
    });
  });
});
