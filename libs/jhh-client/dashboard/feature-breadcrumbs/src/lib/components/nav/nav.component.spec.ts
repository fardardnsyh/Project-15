import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { NavComponent } from './nav.component';

import { Breadcrumb } from '@jhh/jhh-client/dashboard/domain';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatIconModule, NavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display breadcrumbs', () => {
    const testBreadcrumbs: Breadcrumb[] = [
      { label: 'Home', url: '/home' },
      { label: 'Page', url: '/home/page' },
    ];
    component.breadcrumbs = testBreadcrumbs;
    fixture.detectChanges();

    const listItemElements = fixture.nativeElement.querySelectorAll('li');
    expect(listItemElements.length).toBe(testBreadcrumbs.length);
    expect(listItemElements[0].textContent).toContain('Home');
    expect(listItemElements[1].textContent).toContain('Page');
  });

  it('should use trackByFn for tracking items', () => {
    expect(component.trackByFn(0, { label: 'Home', url: '/home' })).toBe(
      '/home'
    );
  });
});
