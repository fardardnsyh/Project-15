import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as NotesActions from './notes.actions';
import * as NotesSelectors from './notes.selectors';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

import { Note, NotesGroup } from '@jhh/shared/domain';

@Injectable({
  providedIn: 'root',
})
export class NotesFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  notesGroups$: Observable<NotesGroup[]> = this.store.pipe(
    select(NotesSelectors.selectAllNotesGroups)
  );

  addNotesGroupInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectAddNotesGroupInProgress)
  );

  addNotesGroupError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectAddNotesGroupError)
  );

  addNotesGroupSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectAddNotesGroupSuccess)
  );

  editNotesGroupInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectEditNotesGroupInProgress)
  );

  editNotesGroupError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectEditNotesGroupError)
  );

  editNotesGroupSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectEditNotesGroupSuccess)
  );

  removeNotesGroupInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectRemoveNotesGroupInProgress)
  );

  removeNotesGroupError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectRemoveNotesGroupError)
  );

  removeNotesGroupSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectRemoveNotesGroupSuccess)
  );

  addNoteInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectAddNoteInProgress)
  );

  addNoteError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectAddNoteError)
  );

  addNoteSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectAddNoteSuccess)
  );

  editNoteInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectEditNoteInProgress)
  );

  editNoteError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectEditNoteError)
  );

  editNoteSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectEditNoteSuccess)
  );

  changeNoteGroupInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectChangeNoteGroupInProgress)
  );

  changeNoteGroupError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectChangeNoteGroupError)
  );

  changeNoteGroupSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectChangeNoteGroupSuccess)
  );

  removeNoteInProgress$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectRemoveNoteInProgress)
  );

  removeNoteError$: Observable<string | null> = this.store.pipe(
    select(NotesSelectors.selectRemoveNoteError)
  );

  removeNoteSuccess$: Observable<boolean> = this.store.pipe(
    select(NotesSelectors.selectRemoveNoteSuccess)
  );

  addNotesGroup(name: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.addNotesGroup({
        payload: { name: name },
      }),
      NotesActions.Type.AddNotesGroupSuccess,
      NotesActions.Type.AddNotesGroupFail
    );
  }

  editNotesGroup(groupId: string, name: string, slug: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.editNotesGroup({
        payload: { groupId: groupId, name: name, slug: slug },
      }),
      NotesActions.Type.EditNotesGroupSuccess,
      NotesActions.Type.EditNotesGroupFail
    );
  }

  duplicateNotesGroup(groupId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.duplicateNotesGroup({
        payload: { groupId: groupId },
      }),
      NotesActions.Type.DuplicateNotesGroupSuccess,
      NotesActions.Type.DuplicateNotesGroupFail
    );
  }

  removeNotesGroup(groupId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.removeNotesGroup({
        payload: { groupId: groupId },
      }),
      NotesActions.Type.RemoveNotesGroupSuccess,
      NotesActions.Type.RemoveNotesGroupFail
    );
  }

  addNote(name: string, content: string, groupId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.addNote({
        payload: { name: name, content: content, groupId: groupId },
      }),
      NotesActions.Type.AddNoteSuccess,
      NotesActions.Type.AddNoteFail
    );
  }

  editNote(
    noteId: string,
    name: string,
    slug: string,
    content: string,
    groupId: string
  ) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.editNote({
        payload: {
          noteId: noteId,
          name: name,
          slug: slug,
          content: content,
          groupId: groupId,
        },
      }),
      NotesActions.Type.EditNoteSuccess,
      NotesActions.Type.EditNoteFail
    );
  }

  duplicateNote(noteId: string, groupId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.duplicateNote({
        payload: {
          noteId: noteId,
          groupId: groupId,
        },
      }),
      NotesActions.Type.DuplicateNoteSuccess,
      NotesActions.Type.DuplicateNoteFail
    );
  }

  changeNoteGroup(noteId: string, newGroupId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.changeNoteGroup({
        payload: {
          noteId: noteId,
          newGroupId: newGroupId,
        },
      }),
      NotesActions.Type.ChangeNoteGroupSuccess,
      NotesActions.Type.ChangeNoteGroupFail
    );
  }

  removeNote(noteId: string) {
    return this.actionResolverService.executeAndWatch(
      NotesActions.removeNote({
        payload: { noteId: noteId },
      }),
      NotesActions.Type.RemoveNoteSuccess,
      NotesActions.Type.RemoveNoteFail
    );
  }

  getNotesGroup$BySlug(slug: string): Observable<NotesGroup | undefined> {
    return this.store.pipe(select(NotesSelectors.selectNotesGroupBySlug, slug));
  }

  getNote$BySlugs(
    groupSlug: string,
    noteSlug: string
  ): Observable<Note | undefined | null> {
    return this.store.pipe(
      select(NotesSelectors.selectNoteBySlugs, { groupSlug, noteSlug })
    );
  }

  getNoteSlug$ByIds(
    noteId: string,
    groupId: string
  ): Observable<string | null> {
    return this.store.pipe(
      select(NotesSelectors.selectNoteSlugByIds, { noteId, groupId })
    );
  }

  getGroupSlug$ByGroupId(
    groupId: string
  ): Observable<string | null | undefined> {
    return this.store.pipe(
      select(NotesSelectors.selectGroupSlugByGroupId, { groupId })
    );
  }

  getGroupSlug$ByNoteId(noteId: string): Observable<string | null> {
    return this.store.pipe(
      select(NotesSelectors.selectGroupSlugByNoteId, { noteId })
    );
  }

  getRelatedNotes$(
    exclude: Note,
    limit: number = 12
  ): Observable<Note[] | null> {
    return this.store.pipe(
      select(NotesSelectors.selectRelatedNotes, { exclude, limit })
    );
  }

  getGroups$(excludeId?: string): Observable<NotesGroup[] | null> {
    return this.store.pipe(
      select(NotesSelectors.selectAllGroups, { excludeId })
    );
  }

  getLimitedGroups$(length: number = 5): Observable<NotesGroup[]> {
    return this.store.pipe(
      select(NotesSelectors.selectLimitedGroups, { length })
    );
  }

  searchNotesGroups$ByName(query: string): Observable<NotesGroup[] | null> {
    return this.store.pipe(
      select(NotesSelectors.selectSearchNotesGroups, { query })
    );
  }

  searchNotes$ByNameAndGroupId(
    query: string,
    groupId: string
  ): Observable<Note[] | null> {
    return this.store.pipe(
      select(NotesSelectors.selectSearchNotes, { query, groupId })
    );
  }

  resetErrors(): void {
    this.store.dispatch(NotesActions.resetErrors());
  }
}
