import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CalendarComponent } from './calendar.component';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ScheduleEvent } from '@jhh/shared/domain';

class MockScheduleFacade {
  editEventSuccess$ = of(false);
  editEventError$ = of(false);
  events$ = of([
    {
      id: '1',
      title: 'Test Event',
      start: new Date(),
      end: new Date(),
      color: '#fff',
    },
  ]);
  editEvent = jest.fn();
}

class MockMatSnackBar {
  open = jest.fn();
}

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CalendarComponent,
        NoopAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        FlatpickrModule.forRoot(),
      ],
      providers: [
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        {
          provide: ScheduleFacade,
          useClass: MockScheduleFacade,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    component.viewDate = new Date();
    component.events = [];
    component.view = CalendarView.Month;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update calendar events when input events change', () => {
    const newEvents = [
      {
        id: '2',
        title: 'Updated Event',
        start: new Date(),
        end: new Date(),
        color: '#000',
      } as any,
    ];
    component.events = newEvents;
    fixture.detectChanges();

    expect(component.calendarEvents.length).toBe(newEvents.length);
    expect(component.calendarEvents[0].title).toEqual(newEvents[0].title);
  });

  it('should emit toggleIsActiveDayOpen event correctly', () => {
    jest.spyOn(component.toggleIsActiveDayOpen, 'emit');

    component.viewDate = new Date();
    component.isActiveDayOpen = false;
    const testDate = new Date(component.viewDate);
    testDate.setDate(testDate.getDate() + 1);

    component.handleDayClick({ date: testDate, events: [] });

    expect(component.toggleIsActiveDayOpen.emit).toHaveBeenCalledWith(
      expect.any(Boolean)
    );
  });

  it('should call editEvent on ScheduleFacade with correct parameters', () => {
    const initialEvents: ScheduleEvent[] = [
      {
        id: '1',
        title: 'Existing Event',
        start: new Date(),
        end: new Date(),
        color: '#999999',
        description: 'A test event',
      } as ScheduleEvent,
    ];

    component.events = initialEvents;

    const newStart = new Date(
      initialEvents[0].start.getTime() + 1000 * 60 * 60
    );
    const newEnd = new Date(initialEvents[0].end.getTime() + 1000 * 60 * 60);

    fixture.detectChanges();

    component.handleTimesChange({
      event: component.calendarEvents[0],
      newStart: newStart,
      newEnd: newEnd,
    } as any);

    const mockScheduleFacade = TestBed.inject(
      ScheduleFacade
    ) as unknown as MockScheduleFacade;

    expect(mockScheduleFacade.editEvent).toHaveBeenCalledWith(
      initialEvents[0].id,
      newStart,
      newEnd,
      initialEvents[0].title,
      initialEvents[0].color,
      initialEvents[0].description
    );
  });

  it('should display month view with correct data', () => {
    fixture.detectChanges();

    const monthView = fixture.debugElement.query(
      By.css('mwl-calendar-month-view')
    );
    expect(monthView).not.toBeNull();
  });

  it('convertToCalendarEvent should properly convert ScheduleEvent to CalendarEvent', () => {
    const scheduleEvent: ScheduleEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2020-01-01'),
      end: new Date('2020-01-02'),
      color: '#123456',
    } as ScheduleEvent;

    const convertToCalendarEvent = (
      component as any
    ).convertToCalendarEvent.bind(component);
    const calendarEvent = convertToCalendarEvent(scheduleEvent);

    expect(calendarEvent).toEqual({
      id: '1',
      start: new Date('2020-01-01'),
      end: new Date('2020-01-02'),
      title: 'Test Event',
      color: {
        primary: '#123456',
        secondary: 'rgba(18,52,86, 0.3)',
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    });
  });

  it('hexToRgb should convert hex color to RGB array', () => {
    const hexToRgb = (component as any).hexToRgb.bind(component);
    const result = hexToRgb('#123456');

    expect(result).toEqual([18, 52, 86]);
  });
});
