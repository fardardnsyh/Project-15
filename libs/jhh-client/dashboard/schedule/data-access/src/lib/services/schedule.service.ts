import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/domain';
import {
  AddEventPayload,
  AddEventSuccessPayload,
  AddEventSuccessResponse,
  EditEventPayload,
  EditEventSuccessPayload,
  EditEventSuccessResponse,
  RemoveEventPayload,
  RemoveEventSuccessPayload,
  RemoveEventSuccessResponse,
} from '@jhh/jhh-client/dashboard/schedule/domain';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  addEvent(payload: AddEventPayload): Observable<AddEventSuccessPayload> {
    return this.http
      .post<AddEventSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddScheduleEvent,
        {
          start: payload.start,
          end: payload.end,
          title: payload.title,
          color: payload.color,
          description: payload.description,
        }
      )
      .pipe(map((res: AddEventSuccessResponse) => res.data));
  }

  editEvent(payload: EditEventPayload): Observable<EditEventSuccessPayload> {
    return this.http
      .put<EditEventSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditScheduleEvent,
        {
          eventId: payload.eventId,
          start: payload.start,
          end: payload.end,
          title: payload.title,
          color: payload.color,
          description: payload.description,
        }
      )
      .pipe(map((res: EditEventSuccessResponse) => res.data));
  }

  removeEvent(
    payload: RemoveEventPayload
  ): Observable<RemoveEventSuccessPayload> {
    return this.http
      .delete<RemoveEventSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveScheduleEvent,
        {
          params: { eventId: payload.eventId },
        }
      )
      .pipe(map((res: RemoveEventSuccessResponse) => res.data));
  }
}
