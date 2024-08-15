import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ScheduleEvent } from '@jhh/shared/domain';

import * as ScheduleSelectors from './schedule.selectors';
import * as ScheduleActions from './schedule.actions';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

@Injectable({
  providedIn: 'root',
})
export class ScheduleFacade {
  private readonly store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );

  events$: Observable<ScheduleEvent[]> = this.store.pipe(
    select(ScheduleSelectors.selectEvents)
  );

  addEventInProgress$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectAddEventInProgress)
  );

  addEventError$: Observable<string | null> = this.store.pipe(
    select(ScheduleSelectors.selectAddEventError)
  );

  addEventSuccess$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectAddEventSuccess)
  );

  editEventInProgress$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectEditEventInProgress)
  );

  editEventError$: Observable<string | null> = this.store.pipe(
    select(ScheduleSelectors.selectEditEventError)
  );

  editEventSuccess$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectEditEventSuccess)
  );

  removeEventInProgress$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectRemoveEventInProgress)
  );

  removeEventError$: Observable<string | null> = this.store.pipe(
    select(ScheduleSelectors.selectRemoveEventError)
  );

  removeEventSuccess$: Observable<boolean> = this.store.pipe(
    select(ScheduleSelectors.selectRemoveEventSuccess)
  );

  addEvent(
    start: Date,
    end: Date,
    title: string,
    color: string,
    description: string | undefined
  ) {
    return this.actionResolverService.executeAndWatch(
      ScheduleActions.addEvent({
        payload: {
          start,
          end,
          title,
          color,
          description,
        },
      }),
      ScheduleActions.Type.AddEventSuccess,
      ScheduleActions.Type.AddEventFail
    );
  }

  editEvent(
    eventId: string,
    start: Date,
    end: Date,
    title: string,
    color: string,
    description: string | undefined
  ) {
    return this.actionResolverService.executeAndWatch(
      ScheduleActions.editEvent({
        payload: {
          eventId: eventId,
          start: start,
          end: end,
          title: title,
          color: color,
          description: description,
        },
      }),
      ScheduleActions.Type.EditEventSuccess,
      ScheduleActions.Type.EditEventFail
    );
  }

  removeEvent(eventId: string) {
    return this.actionResolverService.executeAndWatch(
      ScheduleActions.removeEvent({
        payload: { eventId: eventId },
      }),
      ScheduleActions.Type.RemoveEventSuccess,
      ScheduleActions.Type.RemoveEventFail
    );
  }

  getEvent$ById(eventId: string): Observable<ScheduleEvent | undefined> {
    return this.store.pipe(select(ScheduleSelectors.selectEventById, eventId));
  }

  getLimitedEvents$(length: number = 5): Observable<ScheduleEvent[]> {
    return this.store.pipe(
      select(ScheduleSelectors.selectLimitedEvents, { length })
    );
  }

  resetErrors(): void {
    this.store.dispatch(ScheduleActions.resetErrors());
  }
}
