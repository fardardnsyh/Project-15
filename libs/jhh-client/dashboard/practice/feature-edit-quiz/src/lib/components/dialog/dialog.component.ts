import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
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
import { filter, Observable, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import _ from 'lodash';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';
import { EditPracticeQuizDialogService } from '../../services/edit-practice-quiz-dialog.service';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { MinArrayLengthValidator } from '@jhh/jhh-client/shared/util-min-array-length-validator';
import { AnswersValidator } from '@jhh/jhh-client/dashboard/practice/util-answers-validator';
import { ImageUrlValidator } from '@jhh/jhh-client/shared/util-image-url-validator';
import { UniqueAnswerValidator } from '@jhh/jhh-client/dashboard/practice/util-unique-answer-validator';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

import {
  QuizField,
  QuizFormErrorKey,
} from '@jhh/jhh-client/dashboard/practice/domain';
import { Quiz, QuizFieldLength } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-edit-practice-quiz-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    WhitespaceSanitizerDirective,
    MatTooltipModule,
  ],
  animations: [
    trigger('removeAnimation', [
      transition(':leave', [animate('225ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly editPracticeQuizDialogService: EditPracticeQuizDialogService =
    inject(EditPracticeQuizDialogService);

  @Input({ required: true }) quiz: Quiz;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  readonly formField: typeof QuizField = QuizField;
  readonly formErrorKey: typeof QuizFormErrorKey = QuizFormErrorKey;
  readonly fieldLength: typeof QuizFieldLength = QuizFieldLength;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  slugPrefix: string;

  editQuizInProgress$: Observable<boolean>;
  editQuizError$: Observable<string | null>;
  editQuizSuccess$: Observable<boolean>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.editQuizInProgress$ = this.practiceFacade.editQuizInProgress$;
    this.editQuizError$ = this.practiceFacade.editQuizError$;
    this.editQuizSuccess$ = this.practiceFacade.editQuizSuccess$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.slugPrefix =
      window.location.href.split(ClientRoute.HomeLink)[0] +
      `${ClientRoute.PracticeLink}` +
      '/';

    this.initFormGroup();
    this.handleReset();
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
    this.questions?.clear();
  }

  get questions(): FormArray {
    return this.formGroup.get(this.formField.Items) as FormArray;
  }

  getAnswers(question: AbstractControl): FormArray {
    return question.get(this.formField.Answers) as FormArray;
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
      const { Slug, Name, Description, ImageUrl, Items } = this.formField;
      const [slug, name, description, imageUrl, items] = [
        Slug,
        Name,
        Description,
        ImageUrl,
        Items,
      ].map((field) => this.formGroup.get(field)?.value);

      if (this.hasFormChanges()) {
        this.practiceFacade.editQuiz(
          this.quiz.id,
          slug,
          name,
          description,
          imageUrl,
          items
        );
      } else {
        this.dialogRef?.close();
      }
    }
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.practiceFacade.resetErrors();
      this.editPracticeQuizDialogService.clearQuizToEdit();
      this.formGroup?.reset();
      this.questions?.clear();
    });
  }

  private hasFormChanges(): boolean {
    const formValues = this.formGroup.value;

    for (const key of Object.keys(formValues)) {
      if (!_.isEqual(formValues[key], this.quiz[key as keyof Quiz])) {
        return true;
      }
    }

    return false;
  }

  private handleReset(): void {
    this.editQuizSuccess$
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
      [this.formField.Slug]: [
        this.quiz.slug,
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinNameLength),
          Validators.maxLength(
            this.fieldLength.MaxNameLength +
              this.fieldLength.MaxNameAndSlugLengthDiff
          ),
        ],
      ],
      [this.formField.Name]: [
        this.quiz.name,
        [
          Validators.required,
          Validators.maxLength(this.fieldLength.MaxNameLength),
        ],
      ],
      [this.formField.Description]: [
        this.quiz.description,
        Validators.maxLength(this.fieldLength.MaxImageUrlLength),
      ],
      [this.formField.ImageUrl]: [
        this.quiz.imageUrl,
        [
          Validators.maxLength(this.fieldLength.MaxImageUrlLength),
          ImageUrlValidator(),
        ],
      ],
      [this.formField.Items]: this.formBuilder.array([], Validators.required),
    });

    const itemsFormArray = this.formGroup.get(
      this.formField.Items
    ) as FormArray;

    this.quiz.items.forEach((item) => {
      const answersFormArray = this.formBuilder.array(
        item.answers.map((answer) =>
          this.formBuilder.group({
            [this.formField.AnswerText]: [
              answer.text,
              [
                Validators.required,
                Validators.minLength(this.fieldLength.MinAnswerLength),
                Validators.maxLength(this.fieldLength.MaxAnswerLength),
              ],
            ],
            [this.formField.IsCorrect]: [answer.isCorrect],
          })
        ),
        [
          Validators.required,
          MinArrayLengthValidator(this.fieldLength.MinAnswers),
          AnswersValidator(),
        ]
      );

      const questionFormGroup = this.formBuilder.group({
        [this.formField.Question]: [
          item.question,
          [
            Validators.required,
            Validators.minLength(this.fieldLength.MinQuestionLength),
            Validators.maxLength(this.fieldLength.MaxQuestionLength),
          ],
        ],
        [this.formField.Answers]: answersFormArray,
      });

      itemsFormArray.push(questionFormGroup);
    });
  }
}
