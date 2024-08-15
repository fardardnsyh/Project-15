import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AddNotePayload,
  AddNotesGroupPayload,
  AddNotesGroupSuccessPayload,
  AddNotesGroupSuccessResponse,
  AddNoteSuccessPayload,
  AddNoteSuccessResponse,
  ChangeNoteGroupPayload,
  ChangeNoteGroupSuccessPayload,
  ChangeNoteGroupSuccessResponse,
  DuplicateNotePayload,
  DuplicateNotesGroupPayload,
  DuplicateNotesGroupSuccessPayload,
  DuplicateNotesGroupSuccessResponse,
  DuplicateNoteSuccessPayload,
  DuplicateNoteSuccessResponse,
  EditNotePayload,
  EditNotesGroupPayload,
  EditNotesGroupSuccessPayload,
  EditNotesGroupSuccessResponse,
  EditNoteSuccessPayload,
  EditNoteSuccessResponse,
  RemoveNotePayload,
  RemoveNotesGroupPayload,
  RemoveNotesGroupSuccessPayload,
  RemoveNotesGroupSuccessResponse,
  RemoveNoteSuccessPayload,
  RemoveNoteSuccessResponse,
} from '@jhh/jhh-client/dashboard/notes/domain';
import { ApiRoute } from '@jhh/shared/domain';

import { environment } from '@jhh/jhh-client/shared/config';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  addNotesGroup(
    payload: AddNotesGroupPayload
  ): Observable<AddNotesGroupSuccessPayload> {
    return this.http
      .post<AddNotesGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddNotesGroup,
        {
          name: payload.name,
        }
      )
      .pipe(map((res: AddNotesGroupSuccessResponse) => res.data));
  }

  editNotesGroup(
    payload: EditNotesGroupPayload
  ): Observable<EditNotesGroupSuccessPayload> {
    return this.http
      .put<EditNotesGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditNotesGroup,
        {
          groupId: payload.groupId,
          name: payload.name,
          slug: payload.slug,
        }
      )
      .pipe(map((res: EditNotesGroupSuccessResponse) => res.data));
  }

  duplicateNotesGroup(
    payload: DuplicateNotesGroupPayload
  ): Observable<DuplicateNotesGroupSuccessPayload> {
    return this.http
      .post<DuplicateNotesGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.DuplicateNotesGroup,
        {
          groupId: payload.groupId,
        }
      )
      .pipe(map((res: DuplicateNotesGroupSuccessResponse) => res.data));
  }

  removeNotesGroup(
    payload: RemoveNotesGroupPayload
  ): Observable<RemoveNotesGroupSuccessPayload> {
    return this.http
      .delete<RemoveNotesGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveNotesGroup,
        {
          params: { groupId: payload.groupId },
        }
      )
      .pipe(map((res: RemoveNotesGroupSuccessResponse) => res.data));
  }

  addNote(payload: AddNotePayload): Observable<AddNoteSuccessPayload> {
    return this.http
      .post<AddNoteSuccessResponse>(this.API_DASHBOARD_URL + ApiRoute.AddNote, {
        name: payload.name,
        content: payload.content,
        groupId: payload.groupId,
      })
      .pipe(map((res: AddNoteSuccessResponse) => res.data));
  }

  editNote(payload: EditNotePayload): Observable<EditNoteSuccessPayload> {
    return this.http
      .put<EditNoteSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditNote,
        {
          noteId: payload.noteId,
          name: payload.name,
          slug: payload.slug,
          content: payload.content,
          groupId: payload.groupId,
        }
      )
      .pipe(map((res: EditNoteSuccessResponse) => res.data));
  }

  duplicateNote(
    payload: DuplicateNotePayload
  ): Observable<DuplicateNoteSuccessPayload> {
    return this.http
      .post<DuplicateNoteSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.DuplicateNote,
        {
          noteId: payload.noteId,
          groupId: payload.groupId,
        }
      )
      .pipe(map((res: DuplicateNoteSuccessResponse) => res.data));
  }

  changeNoteGroup(
    payload: ChangeNoteGroupPayload
  ): Observable<ChangeNoteGroupSuccessPayload> {
    return this.http
      .patch<ChangeNoteGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.ChangeNoteGroup,
        {
          noteId: payload.noteId,
          newGroupId: payload.newGroupId,
        }
      )
      .pipe(map((res: ChangeNoteGroupSuccessResponse) => res.data));
  }

  removeNote(payload: RemoveNotePayload): Observable<RemoveNoteSuccessPayload> {
    return this.http
      .delete<RemoveNoteSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveNote,
        {
          params: { noteId: payload.noteId },
        }
      )
      .pipe(map((res: RemoveNoteSuccessResponse) => res.data));
  }
}
