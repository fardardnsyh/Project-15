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
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { filter, Observable, tap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroupFieldLength } from '@jhh/shared/domain';
import {
  NotesGroupFormErrorKey,
  NotesGroupFormField,
} from '@jhh/jhh-client/dashboard/notes/domain';

@Component({
  selector: 'jhh-add-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    WhitespaceSanitizerDirective,
    MatDividerModule,
  ],
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
})
export class AddGroupComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  readonly fieldLength: typeof NotesGroupFieldLength = NotesGroupFieldLength;
  readonly formField: typeof NotesGroupFormField = NotesGroupFormField;
  readonly formErrorKey: typeof NotesGroupFormErrorKey = NotesGroupFormErrorKey;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  addNotesGroupInProgress$: Observable<boolean>;
  addNotesGroupError$: Observable<string | null>;
  addNotesGroupSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.addNotesGroupInProgress$ = this.notesFacade.addNotesGroupInProgress$;
    this.addNotesGroupError$ = this.notesFacade.addNotesGroupError$;
    this.addNotesGroupSuccess$ = this.notesFacade.addNotesGroupSuccess$;

    this.initFormGroup();
    this.handleReset();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.formGroup?.reset();
      this.notesFacade.resetErrors();
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      this.notesFacade.addNotesGroup(name);
    }
  }

  private handleReset(): void {
    this.addNotesGroupSuccess$
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
          Validators.minLength(this.fieldLength.MinNameLength),
          Validators.maxLength(this.fieldLength.MaxNameLength),
        ],
      ],
    });
  }
}
