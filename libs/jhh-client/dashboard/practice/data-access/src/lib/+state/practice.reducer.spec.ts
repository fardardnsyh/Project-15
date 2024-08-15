import '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';

import {
  initialPracticeState,
  practiceReducer,
  PracticeState,
} from './practice.reducer';
import * as PracticeActions from './practice.actions';

describe('PracticeReducer', () => {
  describe('addQuiz actions', () => {
    it('should set addQuiz inProgress to true', () => {
      const action = PracticeActions.addQuiz({
        payload: { name: 'New Quiz', items: [] },
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.addQuiz.inProgress).toBe(true);
      expect(state.addQuiz.success).toBe(false);
    });

    it('should add a new quiz and set addQuiz success to true', () => {
      const newQuiz = { id: '1', name: 'New Quiz', items: [] };
      const action = PracticeActions.addQuizSuccess({
        payload: { addedQuiz: newQuiz as any },
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.entities[newQuiz.id]).toEqual(newQuiz);
      expect(state.addQuiz.inProgress).toBe(false);
      expect(state.addQuiz.success).toBe(true);
    });

    it('should update state with error information', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add quiz' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = PracticeActions.addQuizFail({ payload: errorResponse });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.addQuiz.error).toBe('Failed to add quiz');
      expect(state.addQuiz.inProgress).toBe(false);
    });
  });

  describe('editQuiz actions', () => {
    it('should set editQuiz inProgress to true', () => {
      const action = PracticeActions.editQuiz({
        payload: { quizId: '1', name: 'Updated Quiz', items: [] } as any,
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.editQuiz.inProgress).toBe(true);
      expect(state.editQuiz.success).toBe(false);
    });

    it('should update a quiz and set editQuiz success to true', () => {
      const updatedQuiz = { id: '1', name: 'Updated Quiz', items: [] };
      const action = PracticeActions.editQuizSuccess({
        payload: { editedQuiz: updatedQuiz as any },
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.entities[updatedQuiz.id]).toEqual(updatedQuiz);
      expect(state.editQuiz.inProgress).toBe(false);
      expect(state.editQuiz.success).toBe(true);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to edit quiz' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = PracticeActions.editQuizFail({ payload: errorResponse });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.editQuiz.error).toBe('Failed to edit quiz');
      expect(state.editQuiz.inProgress).toBe(false);
    });
  });

  describe('removeQuiz actions', () => {
    it('should set removeQuiz inProgress to true', () => {
      const action = PracticeActions.removeQuiz({
        payload: { quizId: '1' },
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.removeQuiz.inProgress).toBe(true);
      expect(state.removeQuiz.success).toBe(false);
    });

    it('should remove a quiz and set removeQuiz success to true', () => {
      const removedQuiz = { id: '1', name: 'Quiz to Remove', items: [] };
      const action = PracticeActions.removeQuizSuccess({
        payload: { removedQuiz } as any,
      });

      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.entities[removedQuiz.id]).toBeUndefined();
      expect(state.removeQuiz.inProgress).toBe(false);
      expect(state.removeQuiz.success).toBe(true);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to remove quiz' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = PracticeActions.removeQuizFail({ payload: errorResponse });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.removeQuiz.error).toBe('Failed to remove quiz');
      expect(state.removeQuiz.inProgress).toBe(false);
    });
  });

  describe('addQuizResults actions', () => {
    it('should set addQuizResults inProgress to true', () => {
      const action = PracticeActions.addQuizResults({
        payload: { quizId: '1', results: [] } as any,
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.addQuizResults.inProgress).toBe(true);
      expect(state.addQuizResults.success).toBe(false);
    });

    it('should update state with error information on failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Failed to add quiz results' },
        status: 400,
        statusText: 'Bad Request',
      });

      const action = PracticeActions.addQuizResultsFail({
        payload: errorResponse,
      });
      const state: PracticeState = practiceReducer(
        initialPracticeState,
        action
      );

      expect(state.addQuizResults.error).toBe('Failed to add quiz results');
      expect(state.addQuizResults.inProgress).toBe(false);
    });
  });
});
