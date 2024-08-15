import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { MinArrayLengthValidator } from '@jhh/jhh-client/shared/util-min-array-length-validator';
import { AnswersValidator } from '@jhh/jhh-client/dashboard/practice/util-answers-validator';
import { ImageUrlValidator } from '@jhh/jhh-client/shared/util-image-url-validator';
import { UniqueAnswerValidator } from '@jhh/jhh-client/dashboard/practice/util-unique-answer-validator';

import {
  QuizField,
  QuizFormErrorKey,
} from '@jhh/jhh-client/dashboard/practice/domain';
import { QuizFieldLength } from '@jhh/shared/domain';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'jhh-practice-add-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatCheckboxModule,
    WhitespaceSanitizerDirective,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  animations: [
    trigger('removeAnimation', [
      transition(':leave', [animate('225ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  readonly formField: typeof QuizField = QuizField;
  readonly formErrorKey: typeof QuizFormErrorKey = QuizFormErrorKey;
  readonly fieldLength: typeof QuizFieldLength = QuizFieldLength;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  addQuizInProgress$: Observable<boolean>;
  addQuizError$: Observable<string | null>;
  addQuizSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.addQuizInProgress$ = this.practiceFacade.addQuizInProgress$;
    this.addQuizError$ = this.practiceFacade.addQuizError$;
    this.addQuizSuccess$ = this.practiceFacade.addQuizSuccess$;

    this.initFormGroup();
    this.handleReset();
  }

  get questions(): FormArray {
    return this.formGroup.get(this.formField.Items) as FormArray;
  }

  getAnswers(question: AbstractControl): FormArray {
    return question.get(this.formField.Answers) as FormArray;
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.practiceFacade.resetErrors();
      this.formGroup?.reset();
      this.questions?.clear();
    });
  }

  addQuestion(): void {
    const questionGroup = this.formBuilder.group({
      [this.formField.Question]: [
        '',
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinQuestionLength),
          Validators.maxLength(this.fieldLength.MaxQuestionLength),
        ],
      ],
      [this.formField.Answers]: this.formBuilder.array(
        [],
        [
          Validators.required,
          MinArrayLengthValidator(this.fieldLength.MinAnswers),
          AnswersValidator(),
          UniqueAnswerValidator(),
        ]
      ),
    });

    this.questions.push(questionGroup);
  }

  addAnswer(questionIndex: number): void {
    const answerGroup = this.formBuilder.group({
      [this.formField.AnswerText]: [
        '',
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinAnswerLength),
          Validators.maxLength(this.fieldLength.MaxAnswerLength),
        ],
      ],
      [this.formField.IsCorrect]: [false],
    });

    (
      (this.questions.at(questionIndex) as FormGroup).get(
        this.formField.Answers
      ) as FormArray
    ).push(answerGroup);
  }

  removeQuestion(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = (this.questions.at(questionIndex) as FormGroup).get(
      this.formField.Answers
    ) as FormArray;

    answers.removeAt(answerIndex);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const { Name, Description, ImageUrl, Items } = this.formField;
      const [name, description, imageUrl, items] = [
        Name,
        Description,
        ImageUrl,
        Items,
      ].map((field) => this.formGroup.get(field)?.value);

      if (name && items) {
        this.practiceFacade.addQuiz(name, description, imageUrl, items);
      }
    }
  }

  private handleReset(): void {
    this.addQuizSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.dialogRef?.close();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Name]: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.fieldLength.MaxNameLength),
        ],
      ],
      [this.formField.Description]: [
        '',
        Validators.maxLength(this.fieldLength.MaxImageUrlLength),
      ],
      [this.formField.ImageUrl]: [
        '',
        [
          Validators.maxLength(this.fieldLength.MaxImageUrlLength),
          ImageUrlValidator(),
        ],
      ],
      [this.formField.Items]: this.formBuilder.array([], Validators.required),
    });
  }
}
