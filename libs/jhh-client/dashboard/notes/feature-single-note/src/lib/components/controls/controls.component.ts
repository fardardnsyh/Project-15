import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { EditNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-note';
import { ChangeNoteGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-change-note-group';
import { RemoveNoteDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-note';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { Note, NotesGroup } from '@jhh/shared/domain';
import { ClientRoute } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-note-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private editNoteDialogService: EditNoteDialogService = inject(
    EditNoteDialogService
  );
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);
  private readonly removeNoteDialogService: RemoveNoteDialogService = inject(
    RemoveNoteDialogService
  );
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input({ required: true }) note: Note;

  groups$: Observable<NotesGroup[] | null>;
  editNoteSuccess$: Observable<boolean>;
  changeNoteGroupSuccess$: Observable<boolean>;
  removeNoteSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.groups$ = this.notesFacade.getGroups$();
    this.editNoteSuccess$ = this.notesFacade.editNoteSuccess$;
    this.changeNoteGroupSuccess$ = this.notesFacade.changeNoteGroupSuccess$;
    this.removeNoteSuccess$ = this.notesFacade.removeNoteSuccess$;

    this.navigateAfterSlugChange();
    this.navigateAfterGroupChange();
    this.navigateAfterRemove();
  }

  openEditNoteDialog(): void {
    this.editNoteDialogService.openDialog(this.note);
  }

  openChangeNoteGroupDialog(): void {
    this.changeNoteGroupDialogService.openDialog(this.note);
  }

  handleDuplicate(): void {
    this.notesFacade.duplicateNote(this.note.id, this.note.groupId);
  }

  openRemoveNoteDialog(): void {
    this.removeNoteDialogService.openDialog(this.note);
  }

  private navigateAfterSlugChange(): void {
    this.editNoteSuccess$
      .pipe(
        filter((success) => success),
        switchMap(() =>
          this.notesFacade.getNoteSlug$ByIds(this.note.id, this.note.groupId)
        ),
        filter((newSlug) => newSlug !== null && newSlug !== this.note.slug),
        tap((newSlug) => {
          const currentUrlSegments: string[] = this.router.url.split('/');
          const slugIndex: number = currentUrlSegments.findIndex(
            (segment) => segment === this.note.slug
          );

          if (slugIndex !== -1) {
            currentUrlSegments[slugIndex] = newSlug!;
            const newNoteLink: string = currentUrlSegments.join('/');

            this.router
              .navigate([''], { skipLocationChange: true })
              .then(() => {
                this.router.navigate([newNoteLink]);
              });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateAfterGroupChange(): void {
    this.changeNoteGroupSuccess$
      .pipe(
        filter((success) => success),
        switchMap(() => this.notesFacade.getGroupSlug$ByNoteId(this.note.id)),
        tap((newGroupSlug) => {
          const currentUrlSegments: string[] = this.router.url.split('/');
          const currentGroupSlug: string = currentUrlSegments[3];
          const noteSlug: string = currentUrlSegments[4];

          const shouldNavigate: boolean =
            noteSlug === this.note.slug && currentGroupSlug !== newGroupSlug;

          if (shouldNavigate) {
            this.router.navigate([ClientRoute.NotesLink + '/' + newGroupSlug]);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private navigateAfterRemove(): void {
    this.removeNoteSuccess$
      .pipe(
        filter((success) => success),
        tap(() => {
          this.router.navigate([this.router.url.replace(this.note.slug, '')]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
