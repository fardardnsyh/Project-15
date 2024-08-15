import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ViewDateToggleComponent } from './view-date-toggle.component';

describe('ViewDateToggleComponent', () => {
  let component: ViewDateToggleComponent;
  let fixture: ComponentFixture<ViewDateToggleComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewDateToggleComponent,
        NoopAnimationsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        FlatpickrModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDateToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit viewDateChange on date change', () => {
    const newDate = new Date(2023, 4, 15);
    const emitSpy = jest.spyOn(component.viewDateChange, 'emit');

    component.handleViewDateChange(newDate, true);

    expect(emitSpy).toHaveBeenCalledWith(newDate);
  });

  it('should emit toggleIsActiveDayOpen on day open/close toggle', () => {
    const emitSpy = jest.spyOn(component.toggleIsActiveDayOpen, 'emit');
    component.handleViewDateChange(new Date(), true);

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should call handleViewDateChange with correct parameters on button click', () => {
    const handleViewDateChangeSpy = jest.spyOn(
      component,
      'handleViewDateChange'
    );
    const buttons =
      fixture.debugElement.nativeElement.querySelectorAll('button');
    const todayButton = buttons[1];
    todayButton.click();

    expect(handleViewDateChangeSpy).toHaveBeenCalled();
  });
});
