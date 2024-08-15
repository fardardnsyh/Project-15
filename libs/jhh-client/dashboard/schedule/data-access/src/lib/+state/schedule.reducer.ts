import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as ScheduleActions from './schedule.actions';

import { ScheduleEvent } from '@jhh/shared/domain';
import { OperationState } from '@jhh/jhh-client/shared/domain';

import { ResetOperationStateError } from '@jhh/jhh-client/shared/util-reset-operation-state-error';

export const SCHEDULE_STATE_KEY = 'schedule';

export interface ScheduleState extends EntityState<ScheduleEvent> {
  addEvent: OperationState;
  editEvent: OperationState;
  removeEvent: OperationState;
}

export const adapter: EntityAdapter<ScheduleEvent> =
  createEntityAdapter<ScheduleEvent>();

export const initialScheduleState: ScheduleState = adapter.getInitialState({
  addEvent: {
    inProgress: false,
    error: null,
    success: false,
  },
  editEvent: {
    inProgress: false,
    error: null,
    success: false,
  },
  removeEvent: {
    inProgress: false,
    error: null,
    success: false,
  },
});

const reducer: ActionReducer<ScheduleState> = createReducer(
  initialScheduleState,
  on(ScheduleActions.setScheduleEvents, (state, { events }) =>
    adapter.setAll(events, state)
  ),
  on(ScheduleActions.addEvent, (state) => ({
    ...state,
    addEvent: {
      ...state.addEvent,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(ScheduleActions.addEventFail, (state, { payload }) => ({
    ...state,
    addEvent: {
      ...state.addEvent,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(ScheduleActions.addEventSuccess, (state, { payload }) => {
    return adapter.addOne(payload.addedEvent, {
      ...state,
      addEvent: {
        ...state.addEvent,
        inProgress: false,
        success: true,
        error: null,
      },
    });
  }),
  on(ScheduleActions.resetAddEventSuccess, (state) => ({
    ...state,
    addEvent: {
      ...state.addEvent,
      success: false,
    },
  })),
  on(ScheduleActions.editEvent, (state) => ({
    ...state,
    editEvent: {
      ...state.editEvent,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(ScheduleActions.editEventFail, (state, { payload }) => ({
    ...state,
    editEvent: {
      ...state.editEvent,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(ScheduleActions.editEventSuccess, (state, { payload }) => ({
    ...adapter.upsertOne(payload.editedEvent, state),
    editEvent: {
      ...state.editEvent,
      inProgress: false,
      success: true,
    },
  })),
  on(ScheduleActions.resetEditEventSuccess, (state) => ({
    ...state,
    editEvent: {
      ...state.editEvent,
      success: false,
    },
  })),
  on(ScheduleActions.removeEvent, (state) => ({
    ...state,
    removeEvent: {
      ...state.removeEvent,
      inProgress: true,
      error: null,
      success: false,
    },
  })),
  on(ScheduleActions.removeEventFail, (state, { payload }) => ({
    ...state,
    removeEvent: {
      ...state.removeEvent,
      inProgress: false,
      error: payload.error.message,
    },
  })),
  on(ScheduleActions.removeEventSuccess, (state, { payload }) => {
    return adapter.removeOne(payload.removedEvent.id, {
      ...state,
      removeEvent: {
        ...state.removeEvent,
        inProgress: false,
        success: true,
      },
    });
  }),
  on(ScheduleActions.resetRemoveEventSuccess, (state) => ({
    ...state,
    removeEvent: {
      ...state.removeEvent,
      success: false,
    },
  })),
  on(ScheduleActions.resetErrors, (state) => {
    return {
      ...state,
      addEvent: ResetOperationStateError(state.addEvent),
      editEvent: ResetOperationStateError(state.editEvent),
      removeEvent: ResetOperationStateError(state.removeEvent),
    };
  })
);

export function scheduleReducer(
  state: ScheduleState | undefined,
  action: Action
) {
  return reducer(state, action);
}
