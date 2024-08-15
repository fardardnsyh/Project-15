import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ScheduleFacade } from './schedule.facade';
import * as ScheduleActions from './schedule.actions';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

describe('ScheduleFacade', () => {
  let facade: ScheduleFacade;
  let store: MockStore;
  let actions$: Observable<any>;
  let mockActionResolverService: Partial<ActionResolverService>;

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
        ScheduleFacade,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    });

    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    facade = TestBed.inject(ScheduleFacade);
  });

  it('should dispatch addEvent action when addEvent is called', () => {
    const eventData = {
      start: new Date(),
      end: new Date(),
      title: 'Test Event',
      color: '#FFFFFF',
      description: 'Test Description',
    };

    facade.addEvent(
      eventData.start,
      eventData.end,
      eventData.title,
      eventData.color,
      eventData.description
    );

    expect(mockActionResolverService.executeAndWatch).toHaveBeenCalledWith(
      ScheduleActions.addEvent({ payload: eventData }),
      ScheduleActions.Type.AddEventSuccess,
      ScheduleActions.Type.AddEventFail
    );
  });

  it('should dispatch editEvent action when editEvent is called', () => {
    const spy = jest.spyOn(mockActionResolverService, 'executeAndWatch');
    const eventDetails = {
      eventId: '1',
      start: new Date(),
      end: new Date(),
      title: 'Updated Event Title',
      color: 'Updated Color',
      description: 'Updated Description',
    };

    facade.editEvent(
      eventDetails.eventId,
      eventDetails.start,
      eventDetails.end,
      eventDetails.title,
      eventDetails.color,
      eventDetails.description
    );

    expect(spy).toHaveBeenCalledWith(
      ScheduleActions.editEvent({ payload: eventDetails }),
      ScheduleActions.Type.EditEventSuccess,
      ScheduleActions.Type.EditEventFail
    );
  });

  it('should dispatch removeEvent action when removeEvent is called', () => {
    const spy = jest.spyOn(mockActionResolverService, 'executeAndWatch');
    const eventId = '1';

    facade.removeEvent(eventId);

    expect(spy).toHaveBeenCalledWith(
      ScheduleActions.removeEvent({ payload: { eventId } }),
      ScheduleActions.Type.RemoveEventSuccess,
      ScheduleActions.Type.RemoveEventFail
    );
  });

  it('should dispatch resetErrors action when resetErrors is called', () => {
    const spy = jest.spyOn(store, 'dispatch');

    facade.resetErrors();

    expect(spy).toHaveBeenCalledWith(ScheduleActions.resetErrors());
  });
});
