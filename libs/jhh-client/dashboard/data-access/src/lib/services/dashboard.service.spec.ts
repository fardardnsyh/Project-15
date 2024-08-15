import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { DashboardService } from './dashboard.service';

import { environment } from '@jhh/jhh-client/shared/config';

import { ApiRoute } from '@jhh/shared/domain';
import { LoadAssignedDataSuccessResponse } from '@jhh/jhh-client/dashboard/domain';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService],
    });

    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load assigned data successfully', () => {
    const mockResponse: LoadAssignedDataSuccessResponse = {
      data: {
        user: {
          username: 'username',
        },
        // ...
      } as any,
    };

    service.loadAssignedData().subscribe((data) => {
      expect(data).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}${ApiRoute.BaseProtected}${ApiRoute.LoadAssignedData}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });
});
