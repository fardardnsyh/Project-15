import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Quiz, QuizItem, QuizResult } from '@jhh/shared/domain';

import * as PracticeSelectors from './practice.selectors';
import * as PracticeActions from './practice.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class PracticeFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  quizzes$: Observable<Quiz[]> = this.store.pipe(
    select(PracticeSelectors.selectQuizzes)
  );

  addQuizInProgress$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizInProgress)
  );

  addQuizError$: Observable<string | null> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizError)
  );

  addQuizSuccess$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizSuccess)
  );

  editQuizInProgress$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectEditQuizInProgress)
  );

  editQuizError$: Observable<string | null> = this.store.pipe(
    select(PracticeSelectors.selectEditQuizError)
  );

  editQuizSuccess$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectEditQuizSuccess)
  );

  removeQuizInProgress$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectRemoveQuizInProgress)
  );

  removeQuizError$: Observable<string | null> = this.store.pipe(
    select(PracticeSelectors.selectRemoveQuizError)
  );

  removeQuizSuccess$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectRemoveQuizSuccess)
  );

  addQuizResultsInProgress$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizResultsInProgress)
  );

  addQuizResultsError$: Observable<string | null> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizResultsError)
  );

  addQuizResultsSuccess$: Observable<boolean> = this.store.pipe(
    select(PracticeSelectors.selectAddQuizResultsSuccess)
  );

  addQuiz(
    name: string,
    description: string | undefined,
    imageUrl: string | undefined,
    items: QuizItem[]
  ) {
    return this.actionResolverService.executeAndWatch(
      PracticeActions.addQuiz({
        payload: {
          name,
          description,
          imageUrl,
          items,
        },
      }),
      PracticeActions.Type.AddQuizSuccess,
      PracticeActions.Type.AddQuizFail
    );
  }

  editQuiz(
    quizId: string,
    slug: string,
    name: string,
    description: string | undefined,
    imageUrl: string | undefined,
    items: QuizItem[]
  ) {
    return this.actionResolverService.executeAndWatch(
      PracticeActions.editQuiz({
        payload: {
          quizId,
          slug,
          name,
          description,
          imageUrl,
          items,
        },
      }),
      PracticeActions.Type.EditQuizSuccess,
      PracticeActions.Type.EditQuizFail
    );
  }

  removeQuiz(quizId: string) {
    return this.actionResolverService.executeAndWatch(
      PracticeActions.removeQuiz({
        payload: { quizId: quizId },
      }),
      PracticeActions.Type.RemoveQuizSuccess,
      PracticeActions.Type.RemoveQuizFail
    );
  }

  addQuizResults(
    quizId: string,
    items: QuizResult[],
    totalScore: number,
    percentage: number
  ) {
    return this.actionResolverService.executeAndWatch(
      PracticeActions.addQuizResults({
        payload: {
          quizId: quizId,
          items: items,
          totalScore: totalScore,
          percentage: percentage,
        },
      }),
      PracticeActions.Type.AddQuizResultsSuccess,
      PracticeActions.Type.AddQuizResultsFail
    );
  }

  getQuiz$BySlug(slug: string): Observable<Quiz | undefined> {
    return this.store.pipe(select(PracticeSelectors.selectQuizBySlug, slug));
  }

  getQuizSlug$ById(quizId: string): Observable<string | null> {
    return this.store.pipe(
      select(PracticeSelectors.selectQuizSlugById, { quizId })
    );
  }

  getLimitedQuizzes$(length: number = 5): Observable<Quiz[]> {
    return this.store.pipe(
      select(PracticeSelectors.selectLimitedQuizzes, { length })
    );
  }

  searchQuizzes$ByName(query: string): Observable<Quiz[] | null> {
    return this.store.pipe(
      select(PracticeSelectors.selectSearchQuizzes, { query })
    );
  }

  resetErrors(): void {
    this.store.dispatch(PracticeActions.resetErrors());
  }
}
