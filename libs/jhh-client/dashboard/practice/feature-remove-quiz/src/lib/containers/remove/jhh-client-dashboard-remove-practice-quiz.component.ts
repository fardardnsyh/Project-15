import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { RemovePracticeQuizDialogService } from '../../services/remove-practice-quiz-dialog.service';

import { Quiz } from '@jhh/shared/domain';

import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'jhh-remove-practice-quiz',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-remove-practice-quiz.component.html',
  styleUrls: ['./jhh-client-dashboard-remove-practice-quiz.component.scss'],
})
export class JhhClientDashboardRemovePracticeQuizComponent implements OnInit {
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);

  quizToRemove$: Observable<Quiz | undefined>;

  ngOnInit(): void {
    this.quizToRemove$ = this.removePracticeQuizDialogService.quizToRemove$;
  }
}
