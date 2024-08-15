import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, SCHEDULE_STATE_KEY, ScheduleState } from './schedule.reducer';

import { ScheduleEvent } from '@jhh/shared/domain';

export const selectScheduleState =
  createFeatureSelector<ScheduleState>(SCHEDULE_STATE_KEY);

export const {
  selectIds: selectEventsIds,
  selectEntities: selectEventsEntities,
  selectAll: selectAllEvents,
  selectTotal: selectTotalEvents,
} = adapter.getSelectors(selectScheduleState);

export const selectEvents = createSelector(
  selectAllEvents,
  (events: ScheduleEvent[]) => events
);

export const selectAddEventInProgress = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.addEvent.inProgress
);

export const selectAddEventError = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.addEvent.error
);

export const selectAddEventSuccess = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.addEvent.success!
);

export const selectEditEventInProgress = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.editEvent.inProgress
);

export const selectEditEventError = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.editEvent.error
);

export const selectEditEventSuccess = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.editEvent.success!
);

export const selectRemoveEventInProgress = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.removeEvent.inProgress
);

export const selectRemoveEventError = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.removeEvent.error
);

export const selectRemoveEventSuccess = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.removeEvent.success!
);

export const selectEventById = createSelector(
  selectAllEvents,
  (events: ScheduleEvent[], id: string) =>
    events.find((event) => event.id === id)
);

export const selectLimitedEvents = createSelector(
  selectAllEvents,
  (events: ScheduleEvent[], props: { length: number }) => {
    const sortedEvents: ScheduleEvent[] = events.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    return sortedEvents.slice(0, props.length);
  }
);
