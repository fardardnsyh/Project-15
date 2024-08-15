import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import * as PracticeActions from './practice.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import { PracticeFacade } from './practice.facade';

describe('PracticeFacade', () => {
  let store: MockStore;
  let facade: PracticeFacade;
  let actions$: Observable<any>;
  let mockActionResolverService: Partial<ActionResolverService>;

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

    TestBed.configureTestingModule({
      providers: [
        PracticeFacade,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    facade = TestBed.inject(PracticeFacade);
  });

  it('should execute and watch addQuiz action', () => {
    const payload = {
      name: 'Quiz Name',
      description: 'Description',
      imageUrl: 'image.jpg',
      items: [],
    };
    facade.addQuiz(
      payload.name,
      payload.description,
      payload.imageUrl,
      payload.items
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      PracticeActions.addQuiz({ payload }),
      PracticeActions.Type.AddQuizSuccess,
      PracticeActions.Type.AddQuizFail
    );
  });

  it('should execute and watch editQuiz action', () => {
    const payload = {
      quizId: '123',
      slug: 'quiz-slug',
      name: 'Updated Quiz Name',
      description: 'Updated Description',
      imageUrl: 'updated-image.jpg',
      items: [],
    };
    facade.editQuiz(
      payload.quizId,
      payload.slug,
      payload.name,
      payload.description,
      payload.imageUrl,
      payload.items
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      PracticeActions.editQuiz({ payload }),
      PracticeActions.Type.EditQuizSuccess,
      PracticeActions.Type.EditQuizFail
    );
  });

  it('should execute and watch removeQuiz action', () => {
    const quizId = '123';
    facade.removeQuiz(quizId);

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      PracticeActions.removeQuiz({ payload: { quizId } }),
      PracticeActions.Type.RemoveQuizSuccess,
      PracticeActions.Type.RemoveQuizFail
    );
  });

  it('should execute and watch addQuizResults action', () => {
    const payload = {
      quizId: '123',
      items: [],
      totalScore: 100,
      percentage: 80,
    };
    facade.addQuizResults(
      payload.quizId,
      payload.items,
      payload.totalScore,
      payload.percentage
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      PracticeActions.addQuizResults({ payload }),
      PracticeActions.Type.AddQuizResultsSuccess,
      PracticeActions.Type.AddQuizResultsFail
    );
  });

  it('should dispatch resetErrors action', () => {
    facade.resetErrors();
    expect(store.dispatch).toHaveBeenCalledWith(PracticeActions.resetErrors());
  });
});
