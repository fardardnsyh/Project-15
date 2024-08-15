import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { environment } from '@jhh/jhh-client/shared/config';

import { ScheduleService } from './schedule.service';

import { ApiRoute } from '@jhh/shared/domain';

describe('ScheduleService', () => {
  let service: ScheduleService;
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
      providers: [ScheduleService],
    });
    service = TestBed.inject(ScheduleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add a event', () => {
    const mockPayload = {
      start: new Date(),
      end: new Date(),
      title: 'Test Event',
      color: '#fff',
    };
    const mockResponse = { data: { eventId: '123', name: 'Test Event' } };

    service.addEvent(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.AddScheduleEvent
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should edit a event', () => {
    const mockPayload = {
      eventId: '123',
      start: new Date(),
      end: new Date(),
      title: 'Updated Event',
      color: '#fff',
    } as any;
    const mockResponse = { data: mockPayload };

    service.editEvent(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.EditScheduleEvent
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should remove a event', () => {
    const mockPayload = { eventId: '123' };
    const mockResponse = { data: { message: 'Event removed' } };

    service.removeEvent(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url ===
          environment.apiUrl +
            ApiRoute.BaseProtected +
            ApiRoute.RemoveScheduleEvent &&
        request.params.get('eventId') === '123'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
