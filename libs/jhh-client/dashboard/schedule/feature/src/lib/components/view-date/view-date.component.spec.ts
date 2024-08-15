import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ViewDateComponent } from './view-date.component';

describe('ViewDateComponent', () => {
  let component: ViewDateComponent;
  let fixture: ComponentFixture<ViewDateComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewDateComponent,
        NoopAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        FlatpickrModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDateComponent);
    component = fixture.componentInstance;
    component.view = CalendarView.Month;
    component.viewDate = new Date();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
