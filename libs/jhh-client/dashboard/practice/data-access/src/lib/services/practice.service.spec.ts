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

import { PracticeService } from './practice.service';

import { ApiRoute } from '@jhh/shared/domain';

describe('PracticeService', () => {
  let service: PracticeService;
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
      providers: [PracticeService],
    });
    service = TestBed.inject(PracticeService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add a quiz', () => {
    const mockPayload = { name: 'Test Quiz', items: [] };
    const mockResponse = { data: { quizId: '123', name: 'Test Quiz' } };

    service.addQuiz(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.AddPracticeQuiz
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should edit a quiz', () => {
    const mockPayload = {
      quizId: '123',
      name: 'Updated Quiz',
      items: [],
    } as any;
    const mockResponse = { data: mockPayload };

    service.editQuiz(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl + ApiRoute.BaseProtected + ApiRoute.EditPracticeQuiz
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('should remove a quiz', () => {
    const mockPayload = { quizId: '123' };
    const mockResponse = { data: { message: 'Quiz removed' } };

    service.removeQuiz(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      (request) =>
        request.url ===
          environment.apiUrl +
            ApiRoute.BaseProtected +
            ApiRoute.RemovePracticeQuiz &&
        request.params.get('quizId') === '123'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should add quiz results', () => {
    const mockPayload = {
      quizId: '123',
      items: [],
      totalScore: 100,
      percentage: 80,
    };
    const mockResponse = { data: { message: 'Results added' } };

    service.addQuizResults(mockPayload).subscribe((response) => {
      expect(response).toEqual(mockResponse.data);
    });

    const req = httpTestingController.expectOne(
      environment.apiUrl +
        ApiRoute.BaseProtected +
        ApiRoute.AddPracticeQuizResults
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });
});
