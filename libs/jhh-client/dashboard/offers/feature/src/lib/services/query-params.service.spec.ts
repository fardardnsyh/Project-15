import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { QueryParamsService } from './query-params.service';

describe('QueryParamsService', () => {
  let service: QueryParamsService;
  let location: Location;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [QueryParamsService],
    });

    service = TestBed.inject(QueryParamsService);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with default query parameters', (done) => {
    const subscription = service
      .getAllQueryParams$()
      .subscribe((queryParams) => {
        try {
          expect(queryParams).toEqual({
            filter: service.defaultFilter,
            sort: service.defaultSort,
            page: service.defaultPage,
            perPage: service.defaultPerPage,
          });
          done();
        } catch (error) {
          done(error);
        } finally {
          subscription.unsubscribe();
        }
      });
  });

  it('should initialize query parameters from current route', () => {
    service['currentFilter$'].next('initial');
    service.setFromCurrentRoute();

    service['currentFilter$'].subscribe((value) => {
      expect(value).not.toEqual('initial');
    });
  });

  it('should update current filter and call updateQueryParams', () => {
    const spy = jest.spyOn(service, 'updateQueryParams');
    const newFilter = 'newFilter';

    service.updateCurrentFilter(newFilter);
    expect(spy).toHaveBeenCalled();
    service['currentFilter$'].subscribe((value) => {
      expect(value).toEqual(newFilter);
    });
  });

  it('should correctly update the current page', () => {
    const newPage = 2;
    service.updateCurrentPage(newPage);
    service['currentPage$'].subscribe((value) => {
      expect(value).toEqual(newPage);
    });
  });

  it('should call replaceState with correct URL', () => {
    jest.spyOn(location, 'replaceState');
    service.updateCurrentFilter('testFilter');

    expect(location.replaceState).toHaveBeenCalledWith(expect.any(String));
  });
});
