import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { RemovePracticeQuizDialogService } from '../../services/remove-practice-quiz-dialog.service';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { Quiz } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-remove-practice-quiz-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);

  @Input({ required: true }) quiz: Quiz;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  removeQuizInProgress$: Observable<boolean>;
  removeQuizError$: Observable<string | null>;
  removeQuizSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.removeQuizInProgress$ = this.practiceFacade.removeQuizInProgress$;
    this.removeQuizError$ = this.practiceFacade.removeQuizError$;
    this.removeQuizSuccess$ = this.practiceFacade.removeQuizSuccess$;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  handleRemove(): void {
    this.practiceFacade.removeQuiz(this.quiz.id);
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.practiceFacade.resetErrors();
      this.removePracticeQuizDialogService.clearQuizToRemove();
    });
  }
}
