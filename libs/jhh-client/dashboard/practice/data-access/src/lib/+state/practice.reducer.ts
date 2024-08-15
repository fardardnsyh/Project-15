import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as PracticeActions from './practice.actions';

import { Quiz } from '@jhh/shared/domain';
import { OperationState } from '@jhh/jhh-client/shared/domain';

import { ResetOperationStateError } from '@jhh/jhh-client/shared/util-reset-operation-state-error';

export const PRACTICE_STATE_KEY = 'practice';

export interface PracticeState extends EntityState<Quiz> {
  addQuiz: OperationState;
  editQuiz: OperationState;
  removeQuiz: OperationState;
  addQuizResults: OperationState;
}

export const adapter: EntityAdapter<Quiz> = createEntityAdapter<Quiz>();

export const initialPracticeState: PracticeState = adapter.getInitialState({
  addQuiz: {
    inProgress: false,
    error: null,
    success: false,
  },
  editQuiz: {
    inProgress: false,
    error: null,
    success: false,
  },
  removeQuiz: {
    inProgress: false,
    error: null,
    success: false,
  },
  addQuizResults: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<PracticeState> = createReducer(
  initialPracticeState,
  on(PracticeActions.setPracticeQuizzes, (state, { quizzes }) =>
    adapter.setAll(quizzes, state)
  ),
  on(PracticeActions.addQuiz, (state) => ({
    ...state,
    addQuiz: {
      ...state.addQuiz,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(PracticeActions.addQuizFail, (state, { payload }) => ({
    ...state,
    addQuiz: {
      ...state.addQuiz,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(PracticeActions.addQuizSuccess, (state, { payload }) => {
    return adapter.addOne(payload.addedQuiz, {
      ...state,
      addQuiz: {
        ...state.addQuiz,
        inProgress: false,
        success: true,
        error: null,
      },
    });
  }),
  on(PracticeActions.resetAddQuizSuccess, (state) => ({
    ...state,
    addQuiz: {
      ...state.addQuiz,
      success: false,
    },
  })),
  on(PracticeActions.editQuiz, (state) => ({
    ...state,
    editQuiz: {
      ...state.editQuiz,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(PracticeActions.editQuizFail, (state, { payload }) => ({
    ...state,
    editQuiz: {
      ...state.editQuiz,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(PracticeActions.editQuizSuccess, (state, { payload }) => ({
    ...adapter.upsertOne(payload.editedQuiz, state),
    editQuiz: {
      ...state.editQuiz,
      inProgress: false,
      success: true,
    },
  })),
  on(PracticeActions.resetEditQuizSuccess, (state) => ({
    ...state,
    editQuiz: {
      ...state.editQuiz,
      success: false,
    },
  })),
  on(PracticeActions.removeQuiz, (state) => ({
    ...state,
    removeQuiz: {
      ...state.removeQuiz,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(PracticeActions.removeQuizFail, (state, { payload }) => ({
    ...state,
    removeQuiz: {
      ...state.removeQuiz,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(PracticeActions.removeQuizSuccess, (state, { payload }) => {
    return adapter.removeOne(payload.removedQuiz.id, {
      ...state,
      removeQuiz: {
        ...state.removeQuiz,
        inProgress: false,
        success: true,
      },
    });
  }),
  on(PracticeActions.resetRemoveQuizSuccess, (state) => ({
    ...state,
    removeQuiz: {
      ...state.removeQuiz,
      success: false,
    },
  })),
  on(PracticeActions.addQuizResults, (state) => ({
    ...state,
    addQuizResults: {
      ...state.addQuizResults,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(PracticeActions.addQuizResultsFail, (state, { payload }) => ({
    ...state,
    addQuizResults: {
      ...state.addQuizResults,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(PracticeActions.addQuizResultsSuccess, (state, { payload }) => {
    const updatedEntities = { ...state.entities };
    const quiz: Quiz | undefined = updatedEntities[payload.quizId];

    if (quiz) {
      const updatedQuiz: Quiz = {
        ...quiz,
        results: [...quiz.results, payload.addedResults],
      };

      updatedEntities[payload.quizId] = updatedQuiz;

      return adapter.setAll(
        Object.values(updatedEntities).filter(
          (quiz): quiz is Quiz => quiz !== undefined
        ),
        {
          ...state,
          addQuizResults: {
            ...state.addQuizResults,
            inProgress: false,
            success: true,
          },
        }
      );
    }

    return state;
  }),
  on(PracticeActions.resetAddQuizResultsSuccess, (state) => ({
    ...state,
    addQuizResults: {
      ...state.addQuizResults,
      success: false,
    },
  })),
  on(PracticeActions.resetErrors, (state) => {
    return {
      ...state,
      addQuiz: ResetOperationStateError(state.addQuiz),
      editQuiz: ResetOperationStateError(state.editQuiz),
      removeQuiz: ResetOperationStateError(state.removeQuiz),
      addQuizResults: ResetOperationStateError(state.addQuizResults),
    };
  })
);

export function practiceReducer(
  state: PracticeState | undefined,
  action: Action
) {
  return reducer(state, action);
}
