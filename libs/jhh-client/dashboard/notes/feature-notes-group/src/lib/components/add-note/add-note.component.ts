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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { filter, Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import DOMPurify from 'dompurify';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { MaxSizeValidator } from '@jhh/jhh-client/shared/util-max-size-validator';
import { BytesToMbPipe } from '@jhh/jhh-client/shared/pipes';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';

import { JhhClientDashboardNoteContentEditorComponent } from '@jhh/jhh-client/dashboard/notes/feature-content-editor';

import { NoteFieldLength, NoteSize } from '@jhh/shared/domain';
import {
  NoteFormErrorKey,
  NoteFormField,
} from '@jhh/jhh-client/dashboard/notes/domain';

@Component({
  selector: 'jhh-add-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    WhitespaceSanitizerDirective,
    MatDividerModule,
    ReactiveFormsModule,
    BytesToMbPipe,
    JhhClientDashboardNoteContentEditorComponent,
  ],
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input({ required: true }) groupId: string;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  private quillInstance: any;
  readonly formField: typeof NoteFormField = NoteFormField;
  readonly fieldLength: typeof NoteFieldLength = NoteFieldLength;
  readonly formErrorKey: typeof NoteFormErrorKey = NoteFormErrorKey;
  readonly noteSize: typeof NoteSize = NoteSize;

  formGroup: FormGroup;

  addNoteInProgress$: Observable<boolean>;
  addNoteError$: Observable<string | null>;
  addNoteSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.addNoteInProgress$ = this.notesFacade.addNoteInProgress$;
    this.addNoteError$ = this.notesFacade.addNoteError$;
    this.addNoteSuccess$ = this.notesFacade.addNoteSuccess$;

    this.handleReset();
    this.initFormGroup();
  }

  handleEditorCreated(quill: any): void {
    this.quillInstance = quill;
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.notesFacade.resetErrors();
      this.formGroup?.reset();
    });
  }

  onSubmit(): void {
    if (this.quillInstance) {
      const html = this.quillInstance.root.innerHTML;
      this.formGroup
        .get(this.formField.Content)
        ?.setValue(html, { emitEvent: false });
    }

    if (this.formGroup.valid) {
      const name = this.formGroup.get(this.formField.Name)?.value;
      const content = DOMPurify.sanitize(
        this.formGroup.get(this.formField.Content)?.value,
        domPurifyConfig
      );

      this.notesFacade.addNote(name, content, this.groupId);
    }
  }

  handleReset(): void {
    this.addNoteSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.dialogRef?.close();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  getContentSizeInBytes(): number {
    const contentValue =
      this.formGroup.get(this.formField.Content)?.value || '';

    return new Blob([contentValue]).size;
  }

  getContentControl(): FormControl {
    const control = this.formGroup.get(this.formField.Content);

    if (control instanceof FormControl) {
      return control;
    }

    throw new Error('Content control is missing or not a FormControl');
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
      [this.formField.Content]: [
        '',
        [MaxSizeValidator(this.noteSize.MaxNoteSize)],
      ],
    });
  }
}
