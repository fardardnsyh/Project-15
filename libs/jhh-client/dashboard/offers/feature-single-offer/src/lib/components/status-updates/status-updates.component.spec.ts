import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';

import { OfferStatus } from '@jhh/shared/domain';

import { StatusUpdatesComponent } from './status-updates.component';

import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('StatusUpdatesComponent', () => {
  let component: StatusUpdatesComponent;
  let fixture: ComponentFixture<StatusUpdatesComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusUpdatesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusUpdatesComponent);
    component = fixture.componentInstance;
    component.extendedUpdates = [
      { date: new Date('2024-02-02'), status: OfferStatus.Interviewing },
    ] as any;
    component.updates = [
      { date: new Date('2024-02-02'), status: OfferStatus.Interviewing },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct icons and dates in the template for each update', () => {
    const newUpdates = [
      { date: new Date('2024-02-01'), status: OfferStatus.Accepted },
      { date: new Date('2024-02-03'), status: OfferStatus.Rejected },
    ] as any;

    component.extendedUpdates = newUpdates;
    component.updates = newUpdates;
    component.ngOnChanges({
      updates: new SimpleChange(null, newUpdates, true),
    });

    fixture.detectChanges();

    const updateElements =
      fixture.debugElement.nativeElement.querySelectorAll('li');
    expect(updateElements.length).toBe(newUpdates.length);
    updateElements.forEach((element: any, index: any) => {
      const icon = element.querySelector('mat-icon').textContent.trim();
      const dateElement = element.querySelector('span').textContent.trim();
      const status = element.querySelector('h4').textContent.trim();

      const date = new Date(newUpdates[index].date);
      const formattedDate = [
        date.getDate().toString().padStart(2, '0'),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getFullYear(),
      ].join('.');

      expect(icon).toEqual(GetOfferStatusIcon(newUpdates[index].status));
      expect(dateElement).toEqual(formattedDate);
      expect(status).toEqual(newUpdates[index].status);
    });
  });
});
