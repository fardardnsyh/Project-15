import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';
import { EditPracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-edit-quiz';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { Quiz } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-practice-quiz-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);
  private readonly editPracticeQuizDialogService: EditPracticeQuizDialogService =
    inject(EditPracticeQuizDialogService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  @Input({ required: true }) quiz: Quiz;
  @Input({ required: true }) isPlayMode$: BehaviorSubject<boolean>;
  @Input({ required: true }) isQuizShuffled$: BehaviorSubject<boolean>;
  @Input({ required: true }) questionsLimit$: BehaviorSubject<number>;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  editQuizSuccess$: Observable<boolean>;
  removeQuizSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.editQuizSuccess$ = this.practiceFacade.editQuizSuccess$;
    this.removeQuizSuccess$ = this.practiceFacade.removeQuizSuccess$;

    this.navigateAfterSlugChange();
    this.navigateAfterRemove();
  }

  turnPlayMode(): void {
    this.isPlayMode$.next(true);
    this.dialogRef.close();
  }

  openPlayDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent, { autoFocus: false });
    this.dialogRef.afterClosed().subscribe(() => {
      this.isQuizShuffled$.next(false);
      this.questionsLimit$.next(0);
    });
  }

  openEditQuizDialog(): void {
    this.editPracticeQuizDialogService.openDialog(this.quiz);
  }

  openRemoveQuizDialog(): void {
    this.removePracticeQuizDialogService.openDialog(this.quiz);
  }

  getQuestionLimits(): number[] {
    const totalQuestions: number = this.quiz.items.length;
    const predefinedOptions: number[] = [5, 10, 15, 25, 40, 50];

    const combinedOptions: number[] = Array.from(
      new Set([...predefinedOptions, totalQuestions])
    );

    const validOptions: number[] = combinedOptions.filter(
      (option) => option <= totalQuestions
    );

    validOptions.sort((a, b) => a - b);

    return validOptions;
  }

  setShuffleQuestions(value: boolean): void {
    this.isQuizShuffled$.next(value);
  }

  setQuestionLimit(value: number): void {
    this.questionsLimit$.next(value);
  }

  private navigateAfterSlugChange(): void {
    this.editQuizSuccess$
      .pipe(
        filter((success) => success),
        switchMap(() => this.practiceFacade.getQuizSlug$ById(this.quiz.id)),
        filter((newSlug) => newSlug !== null && newSlug !== this.quiz.slug),
        tap((newSlug) => {
          const currentUrlSegments: string[] = this.router.url.split('/');
          const slugIndex: number = currentUrlSegments.findIndex(
            (segment) => segment === this.quiz.slug
          );

          if (slugIndex !== -1) {
            currentUrlSegments[slugIndex] = newSlug!;
            const newQuizLink: string = currentUrlSegments.join('/');

            this.router
              .navigate([''], { skipLocationChange: true })
              .then(() => {
                this.router.navigate([newQuizLink]);
              });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateAfterRemove(): void {
    this.removeQuizSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.router.navigate([this.router.url.replace(this.quiz.slug, '')]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
