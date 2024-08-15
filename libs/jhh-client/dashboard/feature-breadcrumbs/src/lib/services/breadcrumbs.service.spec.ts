import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { BreadcrumbsService } from './breadcrumbs.service';

import { Breadcrumb } from '@jhh/jhh-client/dashboard/domain';

describe('BreadcrumbsService', () => {
  let service: BreadcrumbsService;
  let routerEvents: BehaviorSubject<any>;

  function createMockActivatedRouteSnapshot(
    children: ActivatedRouteSnapshot[] = []
  ): ActivatedRouteSnapshot {
    return {
      children: children,
      url: [],
      routeConfig: null,
    } as unknown as ActivatedRouteSnapshot;
  }

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    routerEvents = new BehaviorSubject<any>(null);

    const mockRootRoute: ActivatedRouteSnapshot =
      createMockActivatedRouteSnapshot();

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
            routerState: { snapshot: { root: mockRootRoute } },
          },
        },
        BreadcrumbsService,
      ],
    });

    service = TestBed.inject(BreadcrumbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update breadcrumbs on NavigationEnd event', () => {
    const mockSnapshot: ActivatedRouteSnapshot =
      createMockActivatedRouteSnapshot();

    jest.spyOn(service as any, 'createBreadcrumbs').mockReturnValue([
      { label: 'Home', url: '/home' },
      { label: 'Page', url: '/home/page' },
    ]);

    routerEvents.next(new NavigationEnd(1, '/home/page', '/home/page'));

    service.breadcrumbs$.subscribe((breadcrumbs: Breadcrumb[]) => {
      expect(breadcrumbs).toEqual([
        { label: 'Home', url: '/home' },
        { label: 'Page', url: '/home/page' },
      ]);
    });
  });

  it('should update breadcrumb label by url', () => {
    const initialBreadcrumbs: Breadcrumb[] = [
      { label: 'Home', url: '/home' },
      { label: 'Page', url: '/home/page' },
    ];
    service.breadcrumbs$.next(initialBreadcrumbs);

    service.updateBreadcrumbLabelByUrl('/home/page', 'New Page');

    service.breadcrumbs$.subscribe((breadcrumbs: Breadcrumb[]) => {
      expect(breadcrumbs.find((bc) => bc.url === '/home/page')?.label).toBe(
        'New Page'
      );
    });
  });
});
