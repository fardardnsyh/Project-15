import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { JhhClientDashboardScheduleComponent } from './jhh-client-dashboard-schedule.component';
import { CalendarComponent } from '../../components/calendar/calendar.component';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

class MockScheduleFacade {
  addEventSuccess$ = of(false);
  events$ = of([
    {
      id: '1',
      title: 'Test Event',
      start: new Date(),
      end: new Date(),
      color: '#fff',
    },
  ]);
}

class MockBreakpointService {
  breakpoint$ = of('md');
}

class MockMatSnackBar {
  open = jest.fn();
}

describe('JhhClientDashboardScheduleComponent', () => {
  let component: JhhClientDashboardScheduleComponent;
  let fixture: ComponentFixture<JhhClientDashboardScheduleComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        FlatpickrModule.forRoot(),
        JhhClientDashboardScheduleComponent,
      ],
      providers: [
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: ScheduleFacade, useClass: MockScheduleFacade },
        { provide: BreakpointService, useClass: MockBreakpointService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct breakpoint class', (done) => {
    component.breakpoint$.subscribe((breakpoint) => {
      fixture.detectChanges();
      const controlsElement = fixture.debugElement.query(By.css('.controls'));
      expect(controlsElement.nativeElement.classList.contains(breakpoint)).toBe(
        true
      );
      done();
    });
  });

  it('should handle empty events list', () => {
    component.events$ = of([]);
    fixture.detectChanges();
    const emptyListText = fixture.debugElement.query(By.css('p')).nativeElement
      .textContent;
    expect(emptyListText).toContain('No events found.');
  });

  it('should change calendar view correctly', () => {
    expect(component.view).toBe(CalendarView.Month);
    component.setView(CalendarView.Week);
    fixture.detectChanges();
    expect(component.view).toBe(CalendarView.Week);
  });

  it('should toggle active day open state correctly', () => {
    expect(component.isActiveDayOpen).toBe(true);
    component.toggleIsActiveDayOpen(false);
    fixture.detectChanges();
    expect(component.isActiveDayOpen).toBe(false);
  });

  it('should pass events to calendar component correctly', () => {
    const calendarComponent = fixture.debugElement.query(
      By.directive(CalendarComponent)
    ).componentInstance;
    fixture.detectChanges();
    component.events$.subscribe((events) => {
      expect(calendarComponent.events).toEqual(events);
    });
  });
});
