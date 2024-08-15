import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { ScheduleEvent } from '@jhh/shared/domain';
import {
  AddEventPayload,
  AddEventSuccessPayload,
  EditEventPayload,
  EditEventSuccessPayload,
  RemoveEventPayload,
  RemoveEventSuccessPayload,
} from '@jhh/jhh-client/dashboard/schedule/domain';

export enum Type {
  SetScheduleEvents = '[Schedule] Set Schedule Events',
  AddEvent = '[Schedule] Add Event',
  AddEventFail = '[Schedule] Add Event Fail',
  AddEventSuccess = '[Schedule] Add Event Success',
  ResetAddEventSuccess = '[Schedule] Reset Add Event Success',
  EditEvent = '[Schedule] Edit Event',
  EditEventFail = '[Schedule] Edit Event Fail',
  EditEventSuccess = '[Schedule] Edit Event Success',
  ResetEditEventSuccess = '[Schedule] Reset Edit Event Success',
  RemoveEvent = '[Schedule] Remove Event',
  RemoveEventFail = '[Schedule] Remove Event Fail',
  RemoveEventSuccess = '[Schedule] Remove Event Success',
  ResetRemoveEventSuccess = '[Schedule] Reset Remove Event Success',
  ResetErrors = '[Schedule] Reset Errors',
}

export const setScheduleEvents = createAction(
  Type.SetScheduleEvents,
  props<{ events: ScheduleEvent[] }>()
);

export const addEvent = createAction(
  Type.AddEvent,
  props<{ payload: AddEventPayload }>()
);

export const addEventFail = createAction(
  Type.AddEventFail,
  props<{ payload: HttpErrorResponse }>()
);

export const addEventSuccess = createAction(
  Type.AddEventSuccess,
  props<{ payload: AddEventSuccessPayload }>()
);

export const resetAddEventSuccess = createAction(Type.ResetAddEventSuccess);

export const editEvent = createAction(
  Type.EditEvent,
  props<{ payload: EditEventPayload }>()
);

export const editEventFail = createAction(
  Type.EditEventFail,
  props<{ payload: HttpErrorResponse }>()
);

export const editEventSuccess = createAction(
  Type.EditEventSuccess,
  props<{ payload: EditEventSuccessPayload }>()
);

export const resetEditEventSuccess = createAction(Type.ResetEditEventSuccess);

export const removeEvent = createAction(
  Type.RemoveEvent,
  props<{ payload: RemoveEventPayload }>()
);

export const removeEventFail = createAction(
  Type.RemoveEventFail,
  props<{ payload: HttpErrorResponse }>()
);

export const removeEventSuccess = createAction(
  Type.RemoveEventSuccess,
  props<{ payload: RemoveEventSuccessPayload }>()
);

export const resetRemoveEventSuccess = createAction(
  Type.ResetRemoveEventSuccess
);

export const resetErrors = createAction(Type.ResetErrors);
