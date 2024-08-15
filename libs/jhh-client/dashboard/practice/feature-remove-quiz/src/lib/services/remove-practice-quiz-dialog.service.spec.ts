import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { take } from 'rxjs';

import { RemovePracticeQuizDialogService } from './remove-practice-quiz-dialog.service';

import { Quiz } from '@jhh/shared/domain';

describe('RemovePracticeQuizDialogService', () => {
  let service: RemovePracticeQuizDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemovePracticeQuizDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit quiz when openDialog is called', (done) => {
    const mockQuiz: Quiz = {
      id: '1',
      name: 'Test quiz',
      slug: 'test-quiz-slug',
    } as unknown as Quiz;
    service.quizToRemove$.pipe(take(1)).subscribe((quiz) => {
      expect(quiz).toEqual(mockQuiz);
      done();
    });

    service.openDialog(mockQuiz);
  });

  it('should clear quiz when clearQuizToRemove is called', (done) => {
    service.quizToRemove$.pipe(take(1)).subscribe((quiz) => {
      expect(quiz).toBeUndefined();
      done();
    });

    service.clearQuizToRemove();
  });
});
