import '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';

import { initialNotesState, notesReducer, NotesState } from './notes.reducer';
import * as NotesActions from './notes.actions';

import { Note, NotesGroup } from '@jhh/shared/domain';
import { Dictionary } from '@ngrx/entity';

describe('NotesReducer', () => {
  const initialStateWithGroup: NotesState = {
    ...initialNotesState,
    entities: {
      group1: {
        id: 'group1',
        name: 'Group 1',
        notes: [
          {
            id: 'note1',
            name: 'Original Note',
            content: 'Original Content',
            groupId: 'group1',
          } as Note,
        ],
      } as NotesGroup,
    },
    ids: ['group1'],
  };

  describe('addNotesGroup actions', () => {
    it('should set addNotesGroup inProgress to true', () => {
      const action = NotesActions.addNotesGroup({
        payload: { name: 'New Group' },
      });
      const state: NotesState = notesReducer(initialNotesState, action);

      expect(state.addNotesGroup.inProgress).toBe(true);
      expect(state.addNotesGroup.success).toBe(false);
    });

    it('should add a new notes group and set addNotesGroup success to true', () => {
      const newGroup = { id: '1', name: 'New Group', notes: [] };
      const action = NotesActions.addNotesGroupSuccess({
        payload: { newNotesGroup: newGroup as unknown as NotesGroup },
      });
      const state: NotesState = notesReducer(initialNotesState, action);

      expect(state.entities[newGroup.id]).toEqual(newGroup);
      expect(state.addNotesGroup.inProgress).toBe(false);
      expect(state.addNotesGroup.success).toBe(true);
    });

    it('should update state with error information', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add group' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = NotesActions.addNotesGroupFail({ payload: errorResponse });
      const state: NotesState = notesReducer(initialNotesState, action);

      expect(state.addNotesGroup.error).toBe('Failed to add group');
      expect(state.addNotesGroup.inProgress).toBe(false);
    });
  });

  describe('editNotesGroup actions', () => {
    const existingGroup = { id: '1', name: 'Existing Group', notes: [] };

    const initialStateWithExistingGroup: NotesState = {
      ...initialNotesState,
      entities: {
        [existingGroup.id]: existingGroup,
      } as unknown as Dictionary<NotesGroup>,
      ids: [existingGroup.id],
    };

    it('should set editNotesGroup inProgress to true', () => {
      const action = NotesActions.editNotesGroup({
        payload: {
          groupId: existingGroup.id,
          name: 'Updated Group',
          slug: 'updated-group',
        },
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.editNotesGroup.inProgress).toBe(true);
      expect(state.editNotesGroup.success).toBe(false);
    });

    it('should update an existing notes group and set editNotesGroup success to true', () => {
      const updatedGroup = { ...existingGroup, name: 'Updated Group' };
      const action = NotesActions.editNotesGroupSuccess({
        payload: { editedNotesGroup: updatedGroup as unknown as NotesGroup },
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.entities[existingGroup.id]).toEqual(updatedGroup);
      expect(state.editNotesGroup.inProgress).toBe(false);
      expect(state.editNotesGroup.success).toBe(true);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to edit group' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = NotesActions.editNotesGroupFail({
        payload: errorResponse,
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.editNotesGroup.error).toBe('Failed to edit group');
      expect(state.editNotesGroup.inProgress).toBe(false);
    });
  });

  describe('duplicateNotesGroup actions', () => {
    const existingGroup = { id: '1', name: 'Existing Group', notes: [] };

    const initialStateWithExistingGroup: NotesState = {
      ...initialNotesState,
      entities: {
        [existingGroup.id]: existingGroup,
      } as unknown as Dictionary<NotesGroup>,
      ids: [existingGroup.id],
    };

    it('should set duplicateNotesGroup inProgress to true', () => {
      const action = NotesActions.duplicateNotesGroup({
        payload: { groupId: existingGroup.id },
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.duplicateNotesGroup.inProgress).toBe(true);
    });

    it('should add a duplicated notes group', () => {
      const duplicatedGroup = {
        ...existingGroup,
        id: '2',
        name: 'Existing Group Copy',
      };
      const action = NotesActions.duplicateNotesGroupSuccess({
        payload: {
          duplicatedNotesGroup: duplicatedGroup as unknown as NotesGroup,
        },
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.entities[duplicatedGroup.id]).toEqual(duplicatedGroup);
      expect(state.duplicateNotesGroup.inProgress).toBe(false);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to duplicate group' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = NotesActions.duplicateNotesGroupFail({
        payload: errorResponse,
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.duplicateNotesGroup.error).toBe('Failed to duplicate group');
      expect(state.duplicateNotesGroup.inProgress).toBe(false);
    });
  });

  describe('removeNotesGroup actions', () => {
    const existingGroup = { id: '1', name: 'Existing Group', notes: [] };

    const initialStateWithExistingGroup: NotesState = {
      ...initialNotesState,
      entities: {
        [existingGroup.id]: existingGroup,
      } as unknown as Dictionary<NotesGroup>,
      ids: [existingGroup.id],
    };

    it('should set removeNotesGroup inProgress to true', () => {
      const action = NotesActions.removeNotesGroup({
        payload: { groupId: existingGroup.id },
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.removeNotesGroup.inProgress).toBe(true);
    });

    it('should remove an existing notes group and set removeNotesGroup success to true', () => {
      const action = NotesActions.removeNotesGroupSuccess({
        payload: { removedNotesGroup: existingGroup as unknown as NotesGroup },
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.entities[existingGroup.id]).toBeUndefined();
      expect(state.removeNotesGroup.inProgress).toBe(false);
      expect(state.removeNotesGroup.success).toBe(true);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to remove group' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = NotesActions.removeNotesGroupFail({
        payload: errorResponse,
      });
      const state: NotesState = notesReducer(
        initialStateWithExistingGroup,
        action
      );

      expect(state.removeNotesGroup.error).toBe('Failed to remove group');
      expect(state.removeNotesGroup.inProgress).toBe(false);
    });
  });

  describe('addNote actions', () => {
    it('should handle addNote (in-progress)', () => {
      const action = NotesActions.addNote({
        payload: {
          name: 'New Note',
          content: 'Note content',
          groupId: 'group1',
        },
      });
      const state = notesReducer(initialNotesState, action);
      expect(state.addNote.inProgress).toBe(true);
    });

    it('should handle addNoteSuccess', () => {
      const newNote = {
        id: 'note2',
        name: 'New Note',
        content: 'Note content',
        groupId: 'group1',
      } as Note;
      const action = NotesActions.addNoteSuccess({
        payload: { newNote },
      });
      const state = notesReducer(initialStateWithGroup, action);

      expect(
        state.entities['group1']!.notes.find((note) => note.id === 'note2')
      ).toEqual(newNote);
      expect(state.addNote.success).toBe(true);
    });

    it('should handle addNoteFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add note' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = NotesActions.addNoteFail({ payload: errorResponse });
      const state = notesReducer(initialNotesState, action);
      expect(state.addNote.error).toBe('Failed to add note');
      expect(state.addNote.inProgress).toBe(false);
    });
  });

  describe('editNote actions', () => {
    it('should handle editNote (in-progress)', () => {
      const action = NotesActions.editNote({
        payload: {
          noteId: 'note1',
          name: 'Updated Note',
          slug: 'updated-note',
          content: 'Updated Content',
          groupId: 'group1',
        },
      });
      const state = notesReducer(initialNotesState, action);
      expect(state.editNote.inProgress).toBe(true);
    });

    it('should handle editNoteSuccess', () => {
      const updatedNote = {
        id: 'note1',
        name: 'Updated Note',
        content: 'Updated Content',
        groupId: 'group1',
      } as Note;
      const action = NotesActions.editNoteSuccess({
        payload: { updatedNote },
      });
      const state = notesReducer(initialStateWithGroup, action);

      expect(
        state.entities['group1']!.notes.find((note) => note.id === 'note1')
      ).toEqual(updatedNote);
      expect(state.editNote.success).toBe(true);
    });

    it('should handle editNoteFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to edit note' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = NotesActions.editNoteFail({ payload: errorResponse });
      const state = notesReducer(initialNotesState, action);
      expect(state.editNote.error).toBe('Failed to edit note');
      expect(state.editNote.inProgress).toBe(false);
    });
  });

  describe('duplicateNote actions', () => {
    it('should handle duplicateNote (in-progress)', () => {
      const action = NotesActions.duplicateNote({
        payload: {
          noteId: 'note1',
          groupId: 'group1',
        },
      });
      const state = notesReducer(initialNotesState, action);
      expect(state.duplicateNote.inProgress).toBe(true);
    });

    it('should handle duplicateNoteFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to duplicate note' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = NotesActions.duplicateNoteFail({ payload: errorResponse });
      const state = notesReducer(initialNotesState, action);
      expect(state.duplicateNote.error).toBe('Failed to duplicate note');
      expect(state.duplicateNote.inProgress).toBe(false);
    });
  });

  describe('changeNoteGroup actions', () => {
    it('should handle changeNoteGroup (in-progress)', () => {
      const action = NotesActions.changeNoteGroup({
        payload: {
          noteId: 'note1',
          newGroupId: 'group2',
        },
      });
      const state = notesReducer(initialNotesState, action);
      expect(state.changeNoteGroup.inProgress).toBe(true);
    });

    it('should handle changeNoteGroupFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to change note group' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = NotesActions.changeNoteGroupFail({
        payload: errorResponse,
      });
      const state = notesReducer(initialNotesState, action);
      expect(state.changeNoteGroup.error).toBe('Failed to change note group');
      expect(state.changeNoteGroup.inProgress).toBe(false);
    });
  });

  describe('removeNote actions', () => {
    it('should handle removeNote (in-progress)', () => {
      const action = NotesActions.removeNote({
        payload: { noteId: 'note1' },
      });
      const state = notesReducer(initialNotesState, action);
      expect(state.removeNote.inProgress).toBe(true);
    });

    it('should handle removeNoteFail', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to remove note' },
        status: 400,
        statusText: 'Bad Request',
      });
      const action = NotesActions.removeNoteFail({ payload: errorResponse });
      const state = notesReducer(initialNotesState, action);
      expect(state.removeNote.error).toBe('Failed to remove note');
      expect(state.removeNote.inProgress).toBe(false);
    });
  });
});
