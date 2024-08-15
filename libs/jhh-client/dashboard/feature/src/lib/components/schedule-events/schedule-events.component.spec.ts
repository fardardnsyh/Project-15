import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ScheduleEventsComponent } from './schedule-events.component';

describe('ScheduleEventsComponent', () => {
  let component: ScheduleEventsComponent;
  let fixture: ComponentFixture<ScheduleEventsComponent>;
  let mockActivatedRoute;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ScheduleEventsComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleEventsComponent);
    component = fixture.componentInstance;
    component.events = [
      {
        id: '1',
        title: 'Angular Workshop',
        start: new Date(),
        end: new Date(),
        description: 'Learn Angular with hands-on examples.',
        color: '#ff0000',
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display events if provided', () => {
    fixture.detectChanges();

    const eventElements = fixture.nativeElement.querySelectorAll('li');
    expect(eventElements.length).toBeGreaterThan(0);
    expect(eventElements[0].textContent).toContain('Angular Workshop');
  });

  it('should display "No events found." if events are empty', () => {
    component.events = [];
    fixture.detectChanges();

    const emptyListText =
      fixture.nativeElement.querySelector('.box p').textContent;
    expect(emptyListText).toContain('No events found.');
  });

  it('should display "Add event" link if no events are provided', () => {
    component.events = [];
    fixture.detectChanges();

    const addEventLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(addEventLink.textContent).toContain('Add event');
  });

  it('should display "See more" link if events are provided', () => {
    component.events = [
      {
        id: '2',
        title: 'React Fundamentals',
        start: new Date(),
        end: new Date(),
        description: 'Learn the basics of React',
        color: '#ff0000',
      },
    ] as any;
    fixture.detectChanges();

    const seeMoreLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(seeMoreLink.textContent).toContain('See more');
  });
});
