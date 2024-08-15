import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardPaginationComponent } from './jhh-client-dashboard-pagination.component';

describe('JhhClientDashboardPaginationComponent', () => {
  let component: JhhClientDashboardPaginationComponent;
  let fixture: ComponentFixture<JhhClientDashboardPaginationComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPaginationComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardPaginationComponent);
    component = fixture.componentInstance;
    component.currentPage$ = new BehaviorSubject<number>(1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
