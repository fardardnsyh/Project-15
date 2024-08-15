import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ViewToggleComponent } from './view-toggle.component';

describe('ViewToggleComponent', () => {
  let component: ViewToggleComponent;
  let fixture: ComponentFixture<ViewToggleComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewToggleComponent,
        NoopAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        FlatpickrModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct view', () => {
    component.view = CalendarView.Month;
    fixture.detectChanges();
    expect(fixture.componentInstance.view).toBe(CalendarView.Month);
  });

  it('should emit viewChange event on handleViewChange call', () => {
    const newView = CalendarView.Week;
    const emitSpy = jest.spyOn(component.viewChange, 'emit');

    component.handleViewChange(newView);

    expect(emitSpy).toHaveBeenCalledWith(newView);
  });
});
