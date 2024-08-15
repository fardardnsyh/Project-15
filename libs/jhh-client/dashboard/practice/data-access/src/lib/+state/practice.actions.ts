import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { Quiz } from '@jhh/shared/domain';
import {
  AddQuizPayload,
  AddQuizResultsPayload,
  AddQuizResultsSuccessPayload,
  AddQuizSuccessPayload,
  EditQuizPayload,
  EditQuizSuccessPayload,
  RemoveQuizPayload,
  RemoveQuizSuccessPayload,
} from '@jhh/jhh-client/dashboard/practice/domain';

export enum Type {
  SetPracticeQuizzes = '[Practice] Set Practice Quizzes',
  AddQuiz = '[Practice] Add Quiz',
  AddQuizFail = '[Practice] Add Quiz Fail',
  AddQuizSuccess = '[Practice] Add Quiz Success',
  ResetAddQuizSuccess = '[Practice] Reset Add Quiz Success',
  EditQuiz = '[Practice] Edit Quiz',
  EditQuizFail = '[Practice] Edit Quiz Fail',
  EditQuizSuccess = '[Practice] Edit Quiz Success',
  ResetEditQuizSuccess = '[Practice] Reset Edit Quiz Success',
  RemoveQuiz = '[Practice] Remove Quiz',
  RemoveQuizFail = '[Practice] Remove Quiz Fail',
  RemoveQuizSuccess = '[Practice] Remove Quiz Success',
  ResetRemoveQuizSuccess = '[Practice] Reset Remove Quiz Success',
  AddQuizResults = '[Practice] Add Quiz Results',
  AddQuizResultsFail = '[Practice] Add Quiz Results Fail',
  AddQuizResultsSuccess = '[Practice] Add Quiz Results Success',
  ResetAddQuizResultsSuccess = '[Practice] Reset Add Quiz Results Success',
  ResetErrors = '[Practice] Reset Errors',
}

export const setPracticeQuizzes = createAction(
  Type.SetPracticeQuizzes,
  props<{ quizzes: Quiz[] }>()
);

export const addQuiz = createAction(
  Type.AddQuiz,
  props<{ payload: AddQuizPayload }>()
);

export const addQuizFail = createAction(
  Type.AddQuizFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addQuizSuccess = createAction(
  Type.AddQuizSuccess,
  props<{ payload: AddQuizSuccessPayload }>()
);

export const resetAddQuizSuccess = createAction(Type.ResetAddQuizSuccess);

export const editQuiz = createAction(
  Type.EditQuiz,
  props<{ payload: EditQuizPayload }>()
);

export const editQuizFail = createAction(
  Type.EditQuizFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editQuizSuccess = createAction(
  Type.EditQuizSuccess,
  props<{ payload: EditQuizSuccessPayload }>()
);

export const resetEditQuizSuccess = createAction(Type.ResetEditQuizSuccess);

export const removeQuiz = createAction(
  Type.RemoveQuiz,
  props<{ payload: RemoveQuizPayload }>()
);

export const removeQuizFail = createAction(
  Type.RemoveQuizFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeQuizSuccess = createAction(
  Type.RemoveQuizSuccess,
  props<{ payload: RemoveQuizSuccessPayload }>()
);

export const resetRemoveQuizSuccess = createAction(Type.ResetRemoveQuizSuccess);

export const addQuizResults = createAction(
  Type.AddQuizResults,
  props<{ payload: AddQuizResultsPayload }>()
);

export const addQuizResultsFail = createAction(
  Type.AddQuizResultsFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addQuizResultsSuccess = createAction(
  Type.AddQuizResultsSuccess,
  props<{ payload: AddQuizResultsSuccessPayload }>()
);

export const resetAddQuizResultsSuccess = createAction(
  Type.ResetAddQuizResultsSuccess
);

export const resetErrors = createAction(Type.ResetErrors);
