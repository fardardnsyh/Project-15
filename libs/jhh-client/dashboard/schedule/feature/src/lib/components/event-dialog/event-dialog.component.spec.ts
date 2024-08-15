import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { EventDialogComponent } from './event-dialog.component';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

class MatDialogRefMock {
  close = jest.fn();
}

describe('EventDialogComponent', () => {
  let component: EventDialogComponent;
  let fixture: ComponentFixture<EventDialogComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockScheduleFacade: Partial<ScheduleFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    const dialogRefMock = new MatDialogRefMock();

    mockDialog = {
      open: jest.fn().mockReturnValue(dialogRefMock),
      afterClosed: jest.fn().mockReturnValue(of(null)),
    } as unknown as jest.Mocked<MatDialog>;

    mockScheduleFacade = {
      editEventInProgress$: of(false),
      editEventError$: of(null),
      editEventSuccess$: of(false),
      removeEventInProgress$: of(false),
      removeEventError$: of(null),
      removeEventSuccess$: of(false),
      getEvent$ById: jest.fn().mockReturnValue(
        of({
          id: '123',
          title: 'Mock Event',
          start: new Date(),
          end: new Date(),
          color: '#fff',
        })
      ),
    };

    await TestBed.configureTestingModule({
      imports: [
        EventDialogComponent,
        NoopAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        FlatpickrModule.forRoot(),
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: ScheduleFacade, useValue: mockScheduleFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDialogComponent);
    component = fixture.componentInstance;
    component.clickedEventId$ = new Subject<string | null>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
