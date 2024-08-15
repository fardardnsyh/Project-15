import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import DOMPurify from 'dompurify';

import { domPurifyConfig } from '@jhh/shared/dom-purify-config';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNoteDialogService } from '../../services/edit-note-dialog.service';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { MaxSizeValidator } from '@jhh/jhh-client/shared/util-max-size-validator';
import { BytesToMbPipe } from '@jhh/jhh-client/shared/pipes';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

import { JhhClientDashboardNoteContentEditorComponent } from '@jhh/jhh-client/dashboard/notes/feature-content-editor';

import { Note, NoteFieldLength, NoteSize } from '@jhh/shared/domain';
import {
  NoteFormErrorKey,
  NoteFormField,
} from '@jhh/jhh-client/dashboard/notes/domain';

@Component({
  selector: 'jhh-edit-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatInputModule,
    BytesToMbPipe,
    WhitespaceSanitizerDirective,
    JhhClientDashboardNoteContentEditorComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );

  @Input({ required: true }) noteToEdit: Note;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;
  @ViewChild('scrollTarget') private readonly scrollTarget: ElementRef;

  private quillInstance: any;
  private dialogRef: MatDialogRef<TemplateRef<any>>;
  readonly formField: typeof NoteFormField = NoteFormField;
  readonly fieldLength: typeof NoteFieldLength = NoteFieldLength;
  readonly formErrorKey: typeof NoteFormErrorKey = NoteFormErrorKey;
  readonly noteSize: typeof NoteSize = NoteSize;

  formGroup: FormGroup;
  slugPrefix: string;

  editNoteInProgress$: Observable<boolean>;
  editNoteError$: Observable<string | null>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.editNoteInProgress$ = this.notesFacade.editNoteInProgress$;
    this.editNoteError$ = this.notesFacade.editNoteError$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.slugPrefix = window.location.href.replace(/(\/[^\/?]*$)|(\?.*$)/, '/');

    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.formGroup?.reset();
    this.dialogRef.close();
  }

  handleEditorCreated(quill: any): void {
    this.quillInstance = quill;
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
      const slug = this.formGroup.get(this.formField.Slug)?.value;
      const content = DOMPurify.sanitize(
        this.formGroup.get(this.formField.Content)?.value,
        domPurifyConfig
      );

      if (
        name !== this.noteToEdit.name ||
        slug !== this.noteToEdit.slug ||
        content !== this.noteToEdit.content
      ) {
        this.notesFacade.editNote(
          this.noteToEdit.id,
          name,
          slug,
          content,
          this.noteToEdit.groupId
        );
      } else {
        this.formGroup?.reset();
        this.dialogRef?.close();
      }
    }

    this.scrollTarget.nativeElement.scrollIntoView();
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

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.notesFacade.resetErrors();
      this.editNoteDialogService.clearNoteToEdit();
    });
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Name]: [
        this.noteToEdit.name,
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinNameLength),
          Validators.maxLength(this.fieldLength.MaxNameLength),
        ],
      ],
      [this.formField.Slug]: [
        this.noteToEdit.slug,
        [
          Validators.required,
          Validators.minLength(this.fieldLength.MinNameLength),
          Validators.maxLength(
            this.fieldLength.MaxNameLength +
              this.fieldLength.MaxNameAndSlugLengthDiff
          ),
        ],
      ],
      [this.formField.Content]: [
        this.noteToEdit.content,
        [MaxSizeValidator(this.noteSize.MaxNoteSize)],
      ],
    });
  }
}
