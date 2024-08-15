import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { filter, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { ColorValidator } from '@jhh/jhh-client/shared/util-color-validator';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

import {
  BoardColumnDefaultColor,
  BoardColumnField,
  BoardColumnFormErrorKey,
} from '@jhh/jhh-client/dashboard/board/domain';
import { BoardColumnFieldLength } from '@jhh/shared/domain';

@Component({
  selector: 'jhh-board-add-column',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    WhitespaceSanitizerDirective,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './add-column.component.html',
  styleUrls: ['./add-column.component.scss'],
})
export class AddColumnComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  readonly formField: typeof BoardColumnField = BoardColumnField;
  readonly fieldLength: typeof BoardColumnFieldLength = BoardColumnFieldLength;
  readonly formErrorKey: typeof BoardColumnFormErrorKey =
    BoardColumnFormErrorKey;
  readonly defaultColor: typeof BoardColumnDefaultColor =
    BoardColumnDefaultColor;
  readonly defaultColorValues: string[] = Object.values(this.defaultColor);

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  addBoardColumnSuccess$: Observable<boolean>;
  addBoardColumnInProgress$: Observable<boolean>;
  addBoardColumnError$: Observable<string | null>;

  ngOnInit(): void {
    this.addBoardColumnSuccess$ = this.boardFacade.addBoardColumnSuccess$;
    this.addBoardColumnInProgress$ = this.boardFacade.addBoardColumnInProgress$;
    this.addBoardColumnError$ = this.boardFacade.addBoardColumnError$;

    this.initFormGroup();
    this.handleReset();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.boardFacade.resetErrors();
      this.formGroup.reset({
        [this.formField.Color]: this.defaultColor.SkyBlue,
      });
    });
  }

  selectDefaultColor(color: BoardColumnDefaultColor): void {
    if (this.defaultColorValues.includes(color)) {
      this.formGroup.get(this.formField.Color)?.setValue(color);
    } else {
      this.formGroup
        .get(this.formField.Color)
        ?.setValue(this.defaultColor.SkyBlue);
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      const color = this.formGroup.get(this.formField.Color)?.value;
      if (name && color) {
        this.boardFacade.addBoardColumn(name, color);
      }
    }
  }

  private handleReset(): void {
    this.addBoardColumnSuccess$
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
          Validators.minLength(BoardColumnFieldLength.MinColumnNameLength),
          Validators.maxLength(BoardColumnFieldLength.MaxColumnNameLength),
        ],
      ],
      [this.formField.Color]: [
        this.defaultColor.SkyBlue,
        [Validators.required, ColorValidator],
      ],
    });
  }
}
