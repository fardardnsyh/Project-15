import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { QueryParamsService } from './query-params.service';

const mockRouter = {
  url: '/test-url',
  navigate: jest.fn(),
};
const mockActivatedRoute = {
  snapshot: {
    queryParamMap: {
      get: jest.fn().mockImplementation((key: string) => {
        return key === 'page' ? '2' : 'Oldest';
      }),
    },
  },
};
const mockLocation = {
  replaceState: jest.fn(),
};

describe('QueryParamsService', () => {
  let service: QueryParamsService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QueryParamsService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
      ],
    });
    service = TestBed.inject(QueryParamsService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update current page', () => {
    const updateQueryParamsSpy = jest.spyOn(service, 'updateQueryParams');
    service.updateCurrentPage(3);
    expect(service.getCurrentPage$().getValue()).toBe(3);
    expect(updateQueryParamsSpy).toHaveBeenCalled();
    updateQueryParamsSpy.mockRestore();
  });

  it('should update current sort', () => {
    const updateQueryParamsSpy = jest.spyOn(service, 'updateQueryParams');
    service.updateCurrentSort('Oldest');
    expect(service.getCurrentSort$().getValue()).toBe('Oldest');
    expect(service.getCurrentPage$().getValue()).toBe(service.defaultPage);
    expect(updateQueryParamsSpy).toHaveBeenCalled();
    updateQueryParamsSpy.mockRestore();
  });

  it('should clear query params', () => {
    service.updateCurrentPage(5);
    service.updateCurrentSort('Newest');

    service.clearQueryParams();

    expect(service.getCurrentPage$().getValue()).toBe(service.defaultPage);
    expect(service.getCurrentSort$().getValue()).toBe(service.defaultSort);
  });

  it('should set from current route', () => {
    service.setFromCurrentRoute();

    expect(service.getCurrentPage$().getValue()).toBe(2);
    expect(service.getCurrentSort$().getValue()).toBe('Oldest');
  });
});
