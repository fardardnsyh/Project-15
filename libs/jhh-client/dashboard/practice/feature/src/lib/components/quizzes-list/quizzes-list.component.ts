import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';
import { EditPracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-edit-quiz';

import { GetPercentageClass } from '@jhh/jhh-client/dashboard/practice/util-get-percentage-class';

import { Quiz, QuizResults } from '@jhh/shared/domain';

interface ExtendedQuiz extends Quiz {
  passRate: number | null;
  percentageClass: string;
}

@Component({
  selector: 'jhh-practice-quizzes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './quizzes-list.component.html',
  styleUrls: ['./quizzes-list.component.scss'],
})
export class QuizzesListComponent implements OnInit, OnChanges {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);
  private readonly editPracticeQuizDialogService: EditPracticeQuizDialogService =
    inject(EditPracticeQuizDialogService);

  @Input({ required: true }) quizzes: Quiz[];

  extendedQuizzes: ExtendedQuiz[];

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quizzes']) {
      this.extendQuizzes();
    }
  }

  openEditQuizDialog(quiz: Quiz): void {
    this.editPracticeQuizDialogService.openDialog(quiz);
  }

  openRemoveQuizDialog(quiz: Quiz): void {
    this.removePracticeQuizDialogService.openDialog(quiz);
  }

  trackByFn(index: number, item: ExtendedQuiz): string {
    return item.id;
  }

  private extendQuizzes(): void {
    this.extendedQuizzes = this.quizzes.map((quiz) => {
      const passRate = this.calculatePassRate(quiz.results as QuizResults[]);
      const percentageClass = GetPercentageClass(passRate ?? 0);

      return {
        ...quiz,
        passRate,
        percentageClass,
      };
    });
  }

  private calculatePassRate(results: QuizResults[]): number | null {
    const total: number = results.reduce(
      (sum, result) => sum + result.percentage,
      0
    );
    
    return results.length ? total / results.length : null;
  }
}
