import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { EditPracticeQuizDialogService } from './edit-practice-quiz-dialog.service';

import { Quiz } from '@jhh/shared/domain';

describe('EditPracticeQuizDialogService', () => {
  let service: EditPracticeQuizDialogService;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditPracticeQuizDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the correct Quiz when openDialog is called', (done) => {
    const testQuiz: Quiz = {
      name: 'Quiz',
      description: 'Lorem ipsum',
      items: [] as any,
    } as Quiz;

    service.quizToEdit$.subscribe((value) => {
      expect(value).toEqual(testQuiz);
      done();
    });

    service.openDialog(testQuiz);
  });

  it('should emit undefined when clearQuizToEdit is called', (done) => {
    service.quizToEdit$.subscribe((value) => {
      expect(value).toBeUndefined();
      done();
    });

    service.clearQuizToEdit();
  });
});
