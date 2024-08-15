import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { DashboardFacade } from './dashboard.facade';
import * as DashboardSelectors from './dashboard.selectors';
import * as DashboardActions from './dashboard.actions';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';
import { saveToken, setUser } from '@jhh/jhh-client/auth/data-access';
import { setNotes } from '@jhh/jhh-client/dashboard/notes/data-access';
import { setBoard } from '@jhh/jhh-client/dashboard/board/data-access';
import { setOffers } from '@jhh/jhh-client/dashboard/offers/data-access';
import { setScheduleEvents } from '@jhh/jhh-client/dashboard/schedule/data-access';
import { setPracticeQuizzes } from '@jhh/jhh-client/dashboard/practice/data-access';
import { of } from 'rxjs';

describe('DashboardFacade', () => {
  let store: MockStore;
  let facade: DashboardFacade;
  let mockActionResolverService: Partial<ActionResolverService>;

  const mockData = {
    user: {
      username: 'username',
    },
    newToken: 'new-token',
    notesGroups: [
      {
        name: 'Default Group 1',
        slug: 'default-group-1',
        notes: [
          {
            name: 'Default Note 1',
            slug: 'default-note-1',
            content: 'This is a default note',
          },
        ],
      },
    ],
    boardColumns: [
      {
        name: 'Todo',
        color: '#e55039',
        order: 0,
        items: [{ content: 'Get to work', order: 0 }],
      },
    ],
    offers: [
      {
        position: 'Frontend Developer',
        slug: 'frontend-developer',
      },
    ],
    scheduleEvents: [
      {
        start: new Date(),
        end: new Date(),
        title: 'Example 72h event',
        color: '#e55039',
        description: 'description',
      },
    ],
    practiceQuizzes: [
      {
        name: 'TypeScript',
        slug: 'typescript',
        description: '',
        imageUrl: '',
        items: [],
      },
    ],
  };

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    mockActionResolverService = {
      executeAndWatch: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardFacade,
        provideMockStore(),
        {
          provide: ActionResolverService,
          useValue: mockActionResolverService,
        },
      ],
    });

    store = TestBed.inject(MockStore);
    facade = TestBed.inject(DashboardFacade);
    jest.spyOn(store, 'dispatch');
  });

  it('should select the loadAssignedDataInProgress state', () => {
    const mockInProgress = true;
    store.overrideSelector(
      DashboardSelectors.selectDashboardLoadAssignedDataInProgress,
      mockInProgress
    );

    facade.loadAssignedDataInProgress$.subscribe((inProgress) => {
      expect(inProgress).toEqual(mockInProgress);
    });
  });

  it('should dispatch loadAssignedData action when calling loadAssignedData', () => {
    facade.loadAssignedData();
    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      DashboardActions.loadAssignedData(),
      DashboardActions.Type.LoadAssignedDataSuccess,
      DashboardActions.Type.LoadAssignedDataFail
    );
  });

  it('should dispatch multiple actions when calling setData', () => {
    facade.setData({ payload: mockData as any });

    expect(store.dispatch).toHaveBeenCalledWith(
      setUser({ user: mockData.user as any })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      saveToken({ payload: { token: mockData.newToken as any } })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      setNotes({ notesGroups: mockData.notesGroups as any })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      setBoard({ boardColumns: mockData.boardColumns as any })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      setOffers({ offers: mockData.offers as any })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      setScheduleEvents({ events: mockData.scheduleEvents as any })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      setPracticeQuizzes({ quizzes: mockData.practiceQuizzes as any })
    );
  });

  it('should combine data from multiple facades when calling getHomeData', (done) => {
    jest
      .spyOn(facade['offersFacade'], 'getLimitedOffers$')
      .mockReturnValue(of(mockData.offers as any));
    jest
      .spyOn(facade['scheduleEvent'], 'getLimitedEvents$')
      .mockReturnValue(of(mockData.scheduleEvents as any));
    jest
      .spyOn(facade['boardFacade'], 'getLimitedColumns$')
      .mockReturnValue(of(mockData.boardColumns as any));
    jest
      .spyOn(facade['practiceFacade'], 'getLimitedQuizzes$')
      .mockReturnValue(of(mockData.practiceQuizzes as any));
    jest
      .spyOn(facade['notesFacade'], 'getLimitedGroups$')
      .mockReturnValue(of(mockData.notesGroups as any));

    facade.getHomeData().subscribe((homeData) => {
      expect(homeData).toEqual({
        offers: mockData.offers,
        scheduleEvents: mockData.scheduleEvents,
        boardColumns: mockData.boardColumns,
        quizzes: mockData.practiceQuizzes,
        notesGroups: mockData.notesGroups,
      });
      done();
    });
  });
});
