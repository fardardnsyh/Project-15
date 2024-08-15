import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';
import { QueryParamsService } from '@jhh/jhh-client/dashboard/data-access';

import { QuizzesListComponent } from '../../components/quizzes-list/quizzes-list.component';
import { AddComponent } from '../../components/add/add.component';
import { JhhClientDashboardRemovePracticeQuizComponent } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';
import { JhhClientDashboardSearchbarComponent } from '@jhh/jhh-client/dashboard/feature-searchbar';
import { JhhClientDashboardSortingComponent } from '@jhh/jhh-client/dashboard/feature-sorting';
import { JhhClientDashboardPaginationComponent } from '@jhh/jhh-client/dashboard/feature-pagination';
import { JhhClientDashboardEditPracticeQuizComponent } from '@jhh/jhh-client/dashboard/practice/feature-edit-quiz';

import { Quiz } from '@jhh/shared/domain';
import { QuizzesSort } from '@jhh/jhh-client/dashboard/practice/domain';

@Component({
  selector: 'jhh-practice',
  standalone: true,
  imports: [
    CommonModule,
    QuizzesListComponent,
    JhhClientDashboardRemovePracticeQuizComponent,
    AddComponent,
    JhhClientDashboardSearchbarComponent,
    JhhClientDashboardSortingComponent,
    JhhClientDashboardPaginationComponent,
    JhhClientDashboardEditPracticeQuizComponent,
  ],
  templateUrl: './jhh-client-dashboard-practice.component.html',
  styleUrls: ['./jhh-client-dashboard-practice.component.scss'],
})
export class JhhClientDashboardPracticeComponent implements OnInit, OnDestroy {
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  readonly sortOptionsValues: string[] = Object.values(QuizzesSort);
  readonly quizzesPerPage: number = 12;

  defaultPage: number;
  defaultSort: string;
  totalPages: number;

  quizzes$: Observable<Quiz[]>;
  sortedQuizzes$: Observable<Quiz[]>;
  currentPage$: BehaviorSubject<number>;
  currentSort$: BehaviorSubject<string>;

  ngOnInit(): void {
    this.queryParamsService.setFromCurrentRoute();

    this.quizzes$ = this.practiceFacade.quizzes$;
    this.defaultSort = this.queryParamsService.defaultSort;
    this.defaultPage = this.queryParamsService.defaultPage;
    this.currentPage$ = this.queryParamsService.getCurrentPage$();
    this.currentSort$ = this.queryParamsService.getCurrentSort$();

    this.queryParamsService.updateQueryParams();
    this.getSortedQuizzes();
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  searchQuizzes = (query: string): Observable<Quiz[] | null> => {
    return this.practiceFacade.searchQuizzes$ByName(query);
  };

  handlePageChange(newPage: number): void {
    this.queryParamsService.updateCurrentPage(newPage);
  }

  handleSortChange(newSort: string): void {
    this.queryParamsService.updateCurrentSort(newSort);
  }

  private getSortedQuizzes(): void {
    this.sortedQuizzes$ = combineLatest([
      this.quizzes$,
      this.currentSort$,
      this.currentPage$,
    ]).pipe(
      filter((quizzes) => !!quizzes),
      tap(([quizzes]) => {
        this.totalPages = Math.ceil(quizzes!.length / this.quizzesPerPage);
        const currentPage: number = this.currentPage$.getValue();

        if (
          quizzes!.length <= (currentPage - 1) * this.quizzesPerPage &&
          currentPage > 1
        ) {
          this.queryParamsService.updateCurrentPage(currentPage - 1);
        }
      }),
      map(([quizzes]) => {
        const currentPage: number = this.currentPage$.getValue();
        const currentSort: string = this.currentSort$.getValue();
        const sortedQuizzes: Quiz[] = this.sortQuizzes(
          quizzes!,
          currentSort as QuizzesSort
        );
        const start: number = (currentPage - 1) * this.quizzesPerPage;
        const end: number = start + this.quizzesPerPage;
        return sortedQuizzes.slice(start, end);
      })
    );
  }

  private sortQuizzes(quizzes: Quiz[], sort: QuizzesSort): Quiz[] {
    switch (sort) {
      case QuizzesSort.Latest:
        return quizzes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      case QuizzesSort.Oldest:
        return quizzes
          .slice()
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
      case QuizzesSort.LastEdited:
        return quizzes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      case QuizzesSort.AlphabeticalAsc:
        return quizzes.slice().sort((a, b) => a.name.localeCompare(b.name));
      case QuizzesSort.AlphabeticalDesc:
        return quizzes.slice().sort((a, b) => b.name.localeCompare(a.name));
      case QuizzesSort.ScoreAsc:
        return quizzes.slice().sort((a, b) => {
          const avgScoreA: number = a.results.length
            ? a.results.reduce((sum, r) => sum + r.percentage, 0) /
              a.results.length
            : 0;
          const avgScoreB: number = b.results.length
            ? b.results.reduce((sum, r) => sum + r.percentage, 0) /
              b.results.length
            : 0;
          return avgScoreA - avgScoreB;
        });
      case QuizzesSort.ScoreDesc:
        return quizzes.slice().sort((a, b) => {
          const avgScoreA: number = a.results.length
            ? a.results.reduce((sum, r) => sum + r.percentage, 0) /
              a.results.length
            : 0;
          const avgScoreB: number = b.results.length
            ? b.results.reduce((sum, r) => sum + r.percentage, 0) /
              b.results.length
            : 0;
          return avgScoreB - avgScoreA;
        });
      case QuizzesSort.AmountOfQuestionsAsc:
        return quizzes.slice().sort((a, b) => a.items.length - b.items.length);
      case QuizzesSort.AmountOfQuestionsDesc:
        return quizzes.slice().sort((a, b) => b.items.length - a.items.length);
      default:
        return quizzes;
    }
  }
}
