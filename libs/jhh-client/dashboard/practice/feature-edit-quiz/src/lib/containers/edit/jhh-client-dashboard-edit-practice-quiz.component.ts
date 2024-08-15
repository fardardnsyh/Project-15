import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { EditPracticeQuizDialogService } from '../../services/edit-practice-quiz-dialog.service';

import { Quiz } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-edit-practice-quiz',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './jhh-client-dashboard-edit-practice-quiz.component.html',
  styleUrls: ['./jhh-client-dashboard-edit-practice-quiz.component.scss'],
})
export class JhhClientDashboardEditPracticeQuizComponent implements OnInit {
  private readonly editPracticeQuizDialogService: EditPracticeQuizDialogService =
    inject(EditPracticeQuizDialogService);

  quizToEdit$: Observable<Quiz | undefined>;

  ngOnInit(): void {
    this.quizToEdit$ = this.editPracticeQuizDialogService.quizToEdit$;
  }
}
