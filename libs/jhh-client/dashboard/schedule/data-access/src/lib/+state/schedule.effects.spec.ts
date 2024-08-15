import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { ScheduleEffects } from './schedule.effects';
import { ScheduleService } from '../services/schedule.service';
import { SnackbarService } from '@jhh/jhh-client/shared/util-snackbar';
import * as ScheduleActions from './schedule.actions';

describe('ScheduleEffects', () => {
  let actions$: Observable<any>;
  let effects: ScheduleEffects;
  let scheduleService: jest.Mocked<ScheduleService>;
  let snackbarService: jest.Mocked<SnackbarService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    const mockScheduleService = {
      addEvent: jest.fn(),
      editEvent: jest.fn(),
      removeEvent: jest.fn(),
    };

    const mockSnackbarService = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ScheduleEffects,
        provideMockActions(() => actions$),
        { provide: ScheduleService, useValue: mockScheduleService },
        { provide: SnackbarService, useValue: mockSnackbarService },
      ],
    });

    effects = TestBed.inject(ScheduleEffects);
    scheduleService = TestBed.inject(
      ScheduleService
    ) as jest.Mocked<ScheduleService>;
    snackbarService = TestBed.inject(
      SnackbarService
    ) as jest.Mocked<SnackbarService>;
  });

  it('should dispatch addEventSuccess and resetAddEventSuccess actions on successful event addition', () => {
    const eventPayload = {
      name: 'Event Name',
      date: new Date().toISOString(),
      location: 'Event Location',
    };
    const successPayload = {
      id: '12345',
      ...eventPayload,
    };

    scheduleService.addEvent.mockReturnValue(of(successPayload as any));

    actions$ = of(ScheduleActions.addEvent({ payload: eventPayload as any }));

    effects.addEvent$.subscribe((result) => {
      if (result.type === ScheduleActions.addEventSuccess.type) {
        expect(result).toEqual(
          ScheduleActions.addEventSuccess({ payload: successPayload as any })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Schedule event added successfully!'
        );
      } else if (result.type === ScheduleActions.resetAddEventSuccess.type) {
        expect(result).toEqual(ScheduleActions.resetAddEventSuccess());
      }
    });
  });

  it('should dispatch editEventSuccess and resetEditEventSuccess actions on successful event edit', () => {
    const eventEditPayload = {
      id: '12345',
      name: 'Updated Event Name',
      date: new Date().toISOString(),
      location: 'Updated Event Location',
    };
    const successPayload = {
      ...eventEditPayload,
    };

    scheduleService.editEvent.mockReturnValue(of(successPayload as any));

    actions$ = of(
      ScheduleActions.editEvent({ payload: eventEditPayload as any })
    );

    effects.editEvent$.subscribe((result) => {
      if (result.type === ScheduleActions.editEventSuccess.type) {
        expect(result).toEqual(
          ScheduleActions.editEventSuccess({ payload: successPayload as any })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Schedule event edited successfully!'
        );
      } else if (result.type === ScheduleActions.resetEditEventSuccess.type) {
        expect(result).toEqual(ScheduleActions.resetEditEventSuccess());
      }
    });
  });

  it('should dispatch removeEventSuccess and resetRemoveEventSuccess actions on successful event removal', () => {
    const eventRemovePayload = {
      id: '12345',
    };
    const successPayload = {
      id: eventRemovePayload.id,
    };

    scheduleService.removeEvent.mockReturnValue(of(successPayload as any));

    actions$ = of(
      ScheduleActions.removeEvent({ payload: eventRemovePayload as any })
    );

    effects.removeEvent$.subscribe((result) => {
      if (result.type === ScheduleActions.removeEventSuccess.type) {
        expect(result).toEqual(
          ScheduleActions.removeEventSuccess({ payload: successPayload as any })
        );
        expect(snackbarService.open).toHaveBeenCalledWith(
          'Schedule event removed successfully!'
        );
      } else if (result.type === ScheduleActions.resetRemoveEventSuccess.type) {
        expect(result).toEqual(ScheduleActions.resetRemoveEventSuccess());
      }
    });
  });
});
