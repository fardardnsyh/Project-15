import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  filter,
  Observable,
  pluck,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { QuestionsComponent } from '../../components/questions/questions.component';
import { DetailsComponent } from '../../components/details/details.component';
import { ControlsComponent } from '../../components/controls/controls.component';
import { PlayComponent } from '../../components/play/play.component';
import { ResultsComponent } from '../../components/results/results.component';
import { JhhClientDashboardRemovePracticeQuizComponent } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';
import { JhhClientDashboardEditPracticeQuizComponent } from '@jhh/jhh-client/dashboard/practice/feature-edit-quiz';

import { Quiz } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-practice-quiz',
  standalone: true,
  imports: [
    CommonModule,
    QuestionsComponent,
    DetailsComponent,
    ControlsComponent,
    JhhClientDashboardRemovePracticeQuizComponent,
    PlayComponent,
    ResultsComponent,
    JhhClientDashboardEditPracticeQuizComponent,
  ],
  templateUrl: './jhh-client-dashboard-practice-single-quiz.component.html',
  styleUrls: ['./jhh-client-dashboard-practice-single-quiz.component.scss'],
})
export class JhhClientDashboardPracticeSingleQuizComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  quiz$: Observable<Quiz>;
  breakpoint$: Observable<string>;
  isPlayMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isQuizShuffled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  questionsLimit$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.quiz$ = this.route.params.pipe(
      pluck('quizSlug'),
      switchMap((slug: string) => this.practiceFacade.getQuiz$BySlug(slug)),
      tap((quiz) => {
        if (!quiz) {
          this.router.navigate([ClientRoute.NotFoundLink]);
          return;
        }

        this.breadcrumbsService.updateBreadcrumbLabelByUrl(
          this.router.url.split('?')[0],
          quiz.name
        );
        this.titleService.setTitle(`Quiz - ${quiz.name}`);
      }),
      filter((quiz): quiz is Quiz => !!quiz)
    );
  }
}
