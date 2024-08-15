import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';

import { JhhClientDashboardSortingComponent } from './jhh-client-dashboard-sorting.component';

describe('JhhClientDashboardSortingComponent', () => {
  let component: JhhClientDashboardSortingComponent;
  let fixture: ComponentFixture<JhhClientDashboardSortingComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardSortingComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardSortingComponent);
    component = fixture.componentInstance;
    component.currentSort$ = new BehaviorSubject<string>('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
