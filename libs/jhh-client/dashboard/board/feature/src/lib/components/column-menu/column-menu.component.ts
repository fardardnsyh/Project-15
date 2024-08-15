import {
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { ColorValidator } from '@jhh/jhh-client/shared/util-color-validator';

import {
  BoardColumn,
  BoardColumnFieldLength,
  BoardColumnItem,
  LocalStorageKey,
} from '@jhh/shared/domain';
import {
  BoardColumnDefaultColor,
  BoardColumnField,
  BoardColumnFormErrorKey,
} from '@jhh/jhh-client/dashboard/board/domain';

@Component({
  selector: 'jhh-board-column-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    WhitespaceSanitizerDirective,
    MatInputModule,
  ],
  templateUrl: './column-menu.component.html',
  styleUrls: ['./column-menu.component.scss'],
})
export class ColumnMenuComponent implements OnInit, OnDestroy {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @Input({ required: true }) column: BoardColumn;
  @Input({ required: true }) fetchItems: (
    columnId: string
  ) => BoardColumnItem[];
  @ViewChild('editDialogContent')
  private readonly editDialogContent: TemplateRef<any>;
  @ViewChild('removeDialogContent')
  private readonly removeDialogContent: TemplateRef<any>;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  readonly formField: typeof BoardColumnField = BoardColumnField;
  readonly fieldLength: typeof BoardColumnFieldLength = BoardColumnFieldLength;
  readonly formErrorKey: typeof BoardColumnFormErrorKey =
    BoardColumnFormErrorKey;
  readonly defaultColor: typeof BoardColumnDefaultColor =
    BoardColumnDefaultColor;
  readonly defaultColorValues: string[] = Object.values(this.defaultColor);

  formGroup: FormGroup;

  editBoardColumnInProgress$: Observable<boolean>;
  editBoardColumnError$: Observable<string | null>;
  editBoardColumnSuccess$: Observable<boolean>;
  removeBoardColumnInProgress$: Observable<boolean>;
  removeBoardColumnError$: Observable<string | null>;

  ngOnInit(): void {
    this.editBoardColumnInProgress$ =
      this.boardFacade.editBoardColumnInProgress$;
    this.editBoardColumnError$ = this.boardFacade.editBoardColumnError$;
    this.editBoardColumnSuccess$ = this.boardFacade.editBoardColumnSuccess$;
    this.removeBoardColumnInProgress$ =
      this.boardFacade.removeBoardColumnInProgress$;
    this.removeBoardColumnError$ = this.boardFacade.removeBoardColumnError$;

    this.initFormGroup();
    this.handleReset();
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }

  openEditColumnDialog(): void {
    this.dialogRef = this.dialog.open(this.editDialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.boardFacade.resetErrors();
      this.formGroup?.reset({
        [this.formField.Name]: this.column.name,
        [this.formField.Color]: this.column.color,
      });
    });
  }

  openRemoveColumnDialog(): void {
    this.dialogRef = this.dialog.open(this.removeDialogContent);
  }

  handleDuplicate(): void {
    const items: BoardColumnItem[] = this.fetchItems
      ? this.fetchItems(this.column.id)
      : [];

    this.boardFacade.duplicateBoardColumn(this.column.id, items);
  }

  handleRemove(): void {
    const unsavedBoardRequestId: string = String(Date.now());
    localStorage.setItem(
      LocalStorageKey.UnsavedBoardRequestId,
      unsavedBoardRequestId
    );
    this.boardFacade.removeBoardColumn(this.column.id, unsavedBoardRequestId);
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

      if (name !== this.column.name || color !== this.column.color) {
        this.boardFacade.editBoardColumn(this.column.id, name, color);
      } else {
        this.dialogRef?.close();
      }
    }
  }

  private handleReset(): void {
    this.editBoardColumnSuccess$
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
        this.column.name,
        [
          Validators.required,
          Validators.minLength(BoardColumnFieldLength.MinColumnNameLength),
          Validators.maxLength(BoardColumnFieldLength.MaxColumnNameLength),
        ],
      ],
      [this.formField.Color]: [
        this.column.color,
        [Validators.required, ColorValidator],
      ],
    });
  }
}
