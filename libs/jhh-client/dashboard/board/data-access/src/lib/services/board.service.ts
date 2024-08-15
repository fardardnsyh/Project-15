import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/domain';
import {
  AddBoardColumnPayload,
  AddBoardColumnSuccessPayload,
  AddBoardColumnSuccessResponse,
  DuplicateBoardColumnPayload,
  DuplicateBoardColumnSuccessPayload,
  DuplicateBoardColumnSuccessResponse,
  EditBoardColumnPayload,
  EditBoardColumnSuccessPayload,
  EditBoardColumnSuccessResponse,
  RemoveBoardColumnPayload,
  RemoveBoardColumnSuccessPayload,
  RemoveBoardColumnSuccessResponse,
  UpdateBoardColumnsPayload,
  UpdateBoardColumnsSuccessPayload,
  UpdateBoardColumnsSuccessResponse,
} from '@jhh/jhh-client/dashboard/board/domain';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  addBoardColumn(
    payload: AddBoardColumnPayload
  ): Observable<AddBoardColumnSuccessPayload> {
    return this.http
      .post<AddBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddBoardColumn,
        {
          name: payload.name,
          color: payload.color,
        }
      )
      .pipe(map((res: AddBoardColumnSuccessResponse) => res.data));
  }

  editBoardColumn(
    payload: EditBoardColumnPayload
  ): Observable<EditBoardColumnSuccessPayload> {
    return this.http
      .patch<EditBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditBoardColumn,
        {
          columnId: payload.columnId,
          name: payload.name,
          color: payload.color,
        }
      )
      .pipe(map((res: EditBoardColumnSuccessResponse) => res.data));
  }

  duplicateBoardColumn(
    payload: DuplicateBoardColumnPayload
  ): Observable<DuplicateBoardColumnSuccessPayload> {
    return this.http
      .post<DuplicateBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.DuplicateBoardColumn,
        {
          columnId: payload.columnId,
          items: payload.items,
        }
      )
      .pipe(map((res: DuplicateBoardColumnSuccessResponse) => res.data));
  }

  removeBoardColumn(
    payload: RemoveBoardColumnPayload
  ): Observable<RemoveBoardColumnSuccessPayload> {
    let params: HttpParams = new HttpParams().set('columnId', payload.columnId);

    if (payload.unsavedBoardRequestId) {
      params = params.set(
        'unsavedBoardRequestId',
        payload.unsavedBoardRequestId
      );
    }

    return this.http
      .delete<RemoveBoardColumnSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveBoardColumn,
        {
          params: params,
        }
      )
      .pipe(map((res: RemoveBoardColumnSuccessResponse) => res.data));
  }

  updateBoardColumns(
    payload: UpdateBoardColumnsPayload
  ): Observable<UpdateBoardColumnsSuccessPayload> {
    return this.http
      .patch<UpdateBoardColumnsSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.UpdateBoardColumns,
        {
          columnsToUpdate: payload.columnsToUpdate,
          removedItemIds: payload.removedItemIds,
          unsavedBoardRequestId: payload.unsavedBoardRequestId
            ? payload.unsavedBoardRequestId
            : null,
        }
      )
      .pipe(map((res: UpdateBoardColumnsSuccessResponse) => res.data));
  }
}
