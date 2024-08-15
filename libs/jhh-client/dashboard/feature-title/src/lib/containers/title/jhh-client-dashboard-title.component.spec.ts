import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { TitleService } from '../../services/title.service';
import { JhhClientDashboardTitleComponent } from './jhh-client-dashboard-title.component';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('JhhClientDashboardTitleComponent', () => {
  let component: JhhClientDashboardTitleComponent;
  let fixture: ComponentFixture<JhhClientDashboardTitleComponent>;
  let mockTitleService: Partial<TitleService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let titleSubject: BehaviorSubject<string | null>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    titleSubject = new BehaviorSubject<string | null>('Test Title');
    mockTitleService = { title$: titleSubject.asObservable() };

    const routeSnapshot: ActivatedRoute = {
      firstChild: null,
      title: 'Default Title',
    } as unknown as ActivatedRoute;
    mockActivatedRoute = { root: routeSnapshot };

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardTitleComponent],
      providers: [
        { provide: TitleService, useValue: mockTitleService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current route title from TitleService', () => {
    expect(component.currentRouteTitle).toBe('Test Title');
  });

  it('should display the current route title', () => {
    const titleElement =
      fixture.nativeElement.querySelector('jhh-title-heading');
    expect(titleElement.textContent).toContain('Test Title');
  });
});
