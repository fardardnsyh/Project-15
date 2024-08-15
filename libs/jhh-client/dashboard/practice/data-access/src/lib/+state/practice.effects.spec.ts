import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { PracticeEffects } from './practice.effects';
import { PracticeService } from '../services/practice.service';
import * as PracticeActions from './practice.actions';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';

describe('PracticeEffects', () => {
  let actions$: Observable<Action>;
  let effects: PracticeEffects;
  let practiceService: jest.Mocked<PracticeService>;
  let snackbarService: jest.Mocked<SnackbarService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    const mockPracticeService = {
      addQuiz: jest.fn(),
      editQuiz: jest.fn(),
      removeQuiz: jest.fn(),
      addQuizResults: jest.fn(),
    };

    const mockSnackbarService = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PracticeEffects,
        provideMockActions(() => actions$),
        { provide: PracticeService, useValue: mockPracticeService },
        { provide: SnackbarService, useValue: mockSnackbarService },
      ],
    });

    effects = TestBed.inject(PracticeEffects);
    practiceService = TestBed.inject(
      PracticeService
    ) as jest.Mocked<PracticeService>;
    snackbarService = TestBed.inject(
      SnackbarService
    ) as jest.Mocked<SnackbarService>;
  });

  it('should dispatch addQuizSuccess and resetAddQuizSuccess actions on successful quiz addition', () => {
    const quizPayload = {
      name: 'quiz',
      items: [
        {
          question: 'question',
          answers: [
            {
              isCorrect: true,
              text: 'correct answer',
            },
            {
              isCorrect: false,
              text: 'incorrect answer',
            },
          ],
        },
      ],
    };
    const successPayload = {
      id: '1337',
      name: quizPayload.name,
      items: quizPayload.items,
    };

    practiceService.addQuiz.mockReturnValue(of(successPayload as any));
    actions$ = of(PracticeActions.addQuiz({ payload: quizPayload }));

    effects.addQuiz$.subscribe((result) => {
      expect(result).toEqual(
        PracticeActions.addQuizSuccess({ payload: successPayload as any })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Practice quiz added successfully!'
      );
    });
  });

  it('should dispatch editQuizSuccess and resetEditQuizSuccess actions on successful quiz edit', () => {
    const editPayload = { id: '1337', name: 'updated quiz', items: [] };
    const successPayload = { ...editPayload };

    practiceService.editQuiz.mockReturnValue(of(successPayload as any));
    actions$ = of(PracticeActions.editQuiz({ payload: editPayload as any }));

    effects.editQuiz$.subscribe((result) => {
      expect(result).toEqual(
        PracticeActions.editQuizSuccess({ payload: successPayload as any })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Practice quiz edited successfully!'
      );
    });
  });

  it('should dispatch removeQuizSuccess and resetRemoveQuizSuccess actions on successful quiz removal', () => {
    const removePayload = { id: '1337' };
    const successPayload = { id: '1337' };

    practiceService.removeQuiz.mockReturnValue(of(successPayload as any));
    actions$ = of(
      PracticeActions.removeQuiz({ payload: removePayload as any })
    );

    effects.removeQuiz$.subscribe((result) => {
      expect(result).toEqual(
        PracticeActions.removeQuizSuccess({ payload: successPayload as any })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Practice quiz removed successfully!'
      );
    });
  });

  it('should dispatch addQuizResultsSuccess and resetAddQuizResultsSuccess actions on successful quiz results addition', () => {
    const resultsPayload = {
      quizId: '1337',
      results: [{ questionId: '42', isCorrect: true }],
    };
    const successPayload = { quizId: '1337', results: resultsPayload.results };

    practiceService.addQuizResults.mockReturnValue(of(successPayload as any));
    actions$ = of(
      PracticeActions.addQuizResults({ payload: resultsPayload as any })
    );

    effects.addQuizResults$.subscribe((result) => {
      expect(result).toEqual(
        PracticeActions.addQuizResultsSuccess({
          payload: successPayload as any,
        })
      );
      expect(snackbarService.open).toHaveBeenCalledWith(
        'Quiz results saved successfully!'
      );
    });
  });
});
