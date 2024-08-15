import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { Note, NotesGroup } from '@jhh/shared/domain';
import { OperationState } from '@jhh/jhh-client/shared/domain';

import * as NotesActions from './notes.actions';

import { ResetOperationStateError } from '@jhh/jhh-client/shared/util-reset-operation-state-error';

export const NOTES_STATE_KEY = 'notes';

export interface NotesState extends EntityState<NotesGroup> {
  addNotesGroup: OperationState;
  editNotesGroup: OperationState;
  duplicateNotesGroup: OperationState;
  removeNotesGroup: OperationState;
  addNote: OperationState;
  editNote: OperationState;
  duplicateNote: OperationState;
  changeNoteGroup: OperationState;
  removeNote: OperationState;
}

export const adapter = createEntityAdapter<NotesGroup>();

export const initialNotesState: NotesState = adapter.getInitialState({
  addNotesGroup: {
    inProgress: false,
    error: null,
    success: false,
  },
  editNotesGroup: {
    inProgress: false,
    error: null,
    success: false,
  },
  duplicateNotesGroup: {
    inProgress: false,
    error: null,
  },
  removeNotesGroup: {
    inProgress: false,
    error: null,
    success: false,
  },
  addNote: {
    inProgress: false,
    error: null,
    success: false,
  },
  editNote: {
    inProgress: false,
    error: null,
    success: false,
  },
  duplicateNote: {
    inProgress: false,
    error: null,
    success: false,
  },
  changeNoteGroup: {
    inProgress: false,
    error: null,
    success: false,
  },
  removeNote: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<NotesState> = createReducer(
  initialNotesState,
  on(NotesActions.setNotes, (state, { notesGroups }) =>
    adapter.setAll(notesGroups, state)
  ),
  on(NotesActions.addNotesGroup, (state) => ({
    ...state,
    addNotesGroup: {
      ...state.addNotesGroup,
      inProgress: true,
      success: false,
    },
  })),
  on(NotesActions.addNotesGroupFail, (state, { payload }) => ({
    ...state,
    addNotesGroup: {
      ...state.addNotesGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.addNotesGroupSuccess, (state, { payload }) => ({
    ...adapter.addOne(payload.newNotesGroup, state),
    addNotesGroup: {
      ...state.addNotesGroup,
      inProgress: false,
      success: true,
    },
  })),
  on(NotesActions.resetAddNotesGroupSuccess, (state) => ({
    ...state,
    addNotesGroup: {
      ...state.addNotesGroup,
      success: false,
    },
  })),
  on(NotesActions.editNotesGroup, (state) => ({
    ...state,
    editNotesGroup: {
      ...state.editNotesGroup,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.editNotesGroupFail, (state, { payload }) => ({
    ...state,
    editNotesGroup: {
      ...state.editNotesGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.editNotesGroupSuccess, (state, { payload }) => ({
    ...adapter.upsertOne(payload.editedNotesGroup, state),
    editNotesGroup: {
      ...state.editNotesGroup,
      inProgress: false,
      success: true,
    },
  })),
  on(NotesActions.resetEditNotesGroupSuccess, (state) => ({
    ...state,
    editNotesGroup: {
      ...state.editNotesGroup,
      success: false,
    },
  })),
  on(NotesActions.duplicateNotesGroup, (state) => ({
    ...state,
    duplicateNotesGroup: {
      ...state.duplicateNotesGroup,
      inProgress: true,
      error: null,
    },
  })),
  on(NotesActions.duplicateNotesGroupFail, (state, { payload }) => ({
    ...state,
    duplicateNotesGroup: {
      ...state.duplicateNotesGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.duplicateNotesGroupSuccess, (state, { payload }) => {
    const updatedState: NotesState = adapter.addOne(
      payload.duplicatedNotesGroup,
      state
    );

    return {
      ...updatedState,
      duplicateNotesGroup: {
        inProgress: false,
        error: null,
      },
    };
  }),
  on(NotesActions.resetDuplicateNotesGroupSuccess, (state) => ({
    ...state,
    duplicateNotesGroup: {
      ...state.duplicateNotesGroup,
      success: false,
    },
  })),
  on(NotesActions.removeNotesGroup, (state) => ({
    ...state,
    removeNotesGroup: {
      ...state.removeNotesGroup,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.removeNotesGroupFail, (state, { payload }) => ({
    ...state,
    removeNotesGroup: {
      ...state.removeNotesGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.removeNotesGroupSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    delete updatedEntities[payload.removedNotesGroup.id];
    const definedEntities = Object.values(updatedEntities).filter(
      (group): group is NotesGroup => group !== undefined
    );

    return adapter.setAll(definedEntities, {
      ...state,
      removeNotesGroup: {
        ...state.removeNotesGroup,
        inProgress: false,
        success: true,
      },
    });
  }),
  on(NotesActions.resetRemoveNotesGroupSuccess, (state) => ({
    ...state,
    removeNotesGroup: {
      ...state.removeNotesGroup,
      success: false,
    },
  })),
  on(NotesActions.addNote, (state) => ({
    ...state,
    addNote: {
      ...state.addNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.addNoteFail, (state, { payload }) => ({
    ...state,
    addNote: {
      ...state.addNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.addNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.newNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: [...group.notes, payload.newNote],
      };

      updatedEntities[payload.newNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          addNote: {
            ...state.addNote,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.resetAddNoteSuccess, (state) => ({
    ...state,
    addNote: {
      ...state.addNote,
      success: false,
    },
  })),
  on(NotesActions.editNote, (state) => ({
    ...state,
    editNote: {
      ...state.editNote,
      inProgress: true,
      error: null,
    },
  })),
  on(NotesActions.editNoteFail, (state, { payload }) => ({
    ...state,
    editNote: {
      ...state.editNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.editNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.updatedNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: group.notes.map((note) =>
          note.id === payload.updatedNote.id ? payload.updatedNote : note
        ),
      };

      updatedEntities[payload.updatedNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          editNote: {
            ...state.editNote,
            inProgress: false,
            error: null,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.resetEditNoteSuccess, (state) => ({
    ...state,
    editNote: {
      ...state.editNote,
      success: false,
    },
  })),
  on(NotesActions.duplicateNote, (state) => ({
    ...state,
    duplicateNote: {
      ...state.duplicateNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.duplicateNoteFail, (state, { payload }) => ({
    ...state,
    duplicateNote: {
      ...state.duplicateNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.duplicateNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.duplicatedNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: [...group.notes, payload.duplicatedNote],
      };

      updatedEntities[payload.duplicatedNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          duplicateNote: {
            ...state.duplicateNote,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.resetDuplicateNoteSuccess, (state) => ({
    ...state,
    duplicateNote: {
      ...state.duplicateNote,
      success: false,
    },
  })),
  on(NotesActions.changeNoteGroup, (state) => ({
    ...state,
    changeNoteGroup: {
      ...state.changeNoteGroup,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.changeNoteGroupFail, (state, { payload }) => ({
    ...state,
    changeNoteGroup: {
      ...state.changeNoteGroup,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.changeNoteGroupSuccess, (state, { payload }) => {
    const { movedNote, previousGroup } = payload;
    const updatedEntities = { ...state.entities };

    if (previousGroup) {
      const updatedPreviousGroup: NotesGroup = {
        ...previousGroup,
        notes: previousGroup.notes.filter(
          (note: Note) => note.id !== movedNote.id
        ),
      };

      updatedEntities[previousGroup.id] = updatedPreviousGroup;
    }

    const newGroup: NotesGroup | undefined = updatedEntities[movedNote.groupId];
    if (newGroup) {
      const updatedNewGroup: NotesGroup = {
        ...newGroup,
        notes: [...newGroup.notes, movedNote],
      };

      updatedEntities[movedNote.groupId] = updatedNewGroup;
    }

    return adapter.setAll(
      Object.values(updatedEntities).filter(
        (group): group is NotesGroup => group !== undefined
      ),
      {
        ...state,
        changeNoteGroup: {
          ...state.changeNoteGroup,
          inProgress: false,
          success: true,
        },
      }
    );
  }),
  on(NotesActions.resetChangeNoteGroupSuccess, (state) => ({
    ...state,
    changeNoteGroup: {
      ...state.changeNoteGroup,
      success: false,
    },
  })),
  on(NotesActions.removeNote, (state) => ({
    ...state,
    removeNote: {
      ...state.removeNote,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(NotesActions.removeNoteFail, (state, { payload }) => ({
    ...state,
    removeNote: {
      ...state.removeNote,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(NotesActions.removeNoteSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const group: NotesGroup | undefined =
      updatedEntities[payload.removedNote.groupId];

    if (group) {
      const updatedGroup: NotesGroup = {
        ...group,
        notes: group.notes.filter((note) => note.id !== payload.removedNote.id),
      };

      updatedEntities[payload.removedNote.groupId] = updatedGroup;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (group): group is NotesGroup => group !== undefined
        ),
        {
          ...state,
          removeNote: {
            ...state.removeNote,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(NotesActions.resetRemoveNoteSuccess, (state) => ({
    ...state,
    removeNote: {
      ...state.removeNote,
      success: false,
    },
  })),
  on(NotesActions.resetErrors, (state) => {
    return {
      ...state,
      addNotesGroup: ResetOperationStateError(state.addNotesGroup),
      editNotesGroup: ResetOperationStateError(state.editNotesGroup),
      duplicateNotesGroup: ResetOperationStateError(state.duplicateNotesGroup),
      removeNotesGroup: ResetOperationStateError(state.removeNotesGroup),
      addNote: ResetOperationStateError(state.addNote),
      editNote: ResetOperationStateError(state.editNote),
      duplicateNote: ResetOperationStateError(state.duplicateNote),
      changeNoteGroup: ResetOperationStateError(state.changeNoteGroup),
      removeNote: ResetOperationStateError(state.removeNote),
    };
  })
);

export function notesReducer(state: NotesState | undefined, action: Action) {
  return reducer(state, action);
}
