import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, Observable, zip } from 'rxjs';

import * as DashboardSelectors from './dashboard.selectors';
import * as DashboardActions from './dashboard.actions';
import { saveToken, setUser } from '@jhh/jhh-client/auth/data-access';
import {
  NotesFacade,
  setNotes,
} from '@jhh/jhh-client/dashboard/notes/data-access';
import {
  BoardFacade,
  setBoard,
} from '@jhh/jhh-client/dashboard/board/data-access';
import {
  OffersFacade,
  setOffers,
} from '@jhh/jhh-client/dashboard/offers/data-access';
import {
  ScheduleFacade,
  setScheduleEvents,
} from '@jhh/jhh-client/dashboard/schedule/data-access';
import {
  PracticeFacade,
  setPracticeQuizzes,
} from '@jhh/jhh-client/dashboard/practice/data-access';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

import {
  HomeData,
  LoadAssignedDataSuccessPayload,
} from '@jhh/jhh-client/dashboard/domain';

@Injectable()
export class DashboardFacade {
  private readonly store: Store = inject(Store);
  private readonly actionResolverService: ActionResolverService = inject(
    ActionResolverService
  );
  private readonly offersFacade: OffersFacade = inject(OffersFacade);
  private readonly scheduleEvent: ScheduleFacade = inject(ScheduleFacade);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  loadAssignedDataInProgress$: Observable<boolean> = this.store.pipe(
    select(DashboardSelectors.selectDashboardLoadAssignedDataInProgress)
  );

  loadAssignedDataError$: Observable<string | null> = this.store.pipe(
    select(DashboardSelectors.selectDashboardLoadAssignedDataError)
  );

  loadAssignedDataSuccess$: Observable<boolean> = this.store.pipe(
    select(DashboardSelectors.selectDashboardLoadAssignedDataSuccess)
  );

  loadAssignedData() {
    return this.actionResolverService.executeAndWatch(
      DashboardActions.loadAssignedData(),
      DashboardActions.Type.LoadAssignedDataSuccess,
      DashboardActions.Type.LoadAssignedDataFail
    );
  }

  setData(data: { payload: LoadAssignedDataSuccessPayload }): void {
    this.store.dispatch(setUser({ user: data.payload.user }));
    this.store.dispatch(
      saveToken({ payload: { token: data.payload.newToken } })
    );
    this.store.dispatch(setNotes({ notesGroups: data.payload.notesGroups }));
    this.store.dispatch(setBoard({ boardColumns: data.payload.boardColumns }));
    this.store.dispatch(setOffers({ offers: data.payload.offers }));
    this.store.dispatch(
      setScheduleEvents({ events: data.payload.scheduleEvents })
    );
    this.store.dispatch(
      setPracticeQuizzes({ quizzes: data.payload.practiceQuizzes })
    );
  }

  getHomeData(): Observable<HomeData> {
    return zip(
      this.offersFacade.getLimitedOffers$(),
      this.scheduleEvent.getLimitedEvents$(),
      this.boardFacade.getLimitedColumns$(),
      this.practiceFacade.getLimitedQuizzes$(),
      this.notesFacade.getLimitedGroups$()
    ).pipe(
      map(([offers, scheduleEvents, boardColumns, quizzes, notesGroups]) => {
        return { offers, scheduleEvents, boardColumns, quizzes, notesGroups };
      })
    );
  }
}
