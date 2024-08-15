import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject } from 'rxjs';

import { JhhClientDashboardRemovePracticeQuizComponent } from './jhh-client-dashboard-remove-practice-quiz.component';

import { Quiz } from '@jhh/shared/domain';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';
import { RemovePracticeQuizDialogService } from '../../services/remove-practice-quiz-dialog.service';

describe('JhhClientDashboardRemovePracticeQuizComponent', () => {
  let component: JhhClientDashboardRemovePracticeQuizComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemovePracticeQuizComponent>;
  let mockRemovePracticeQuizDialogService: any;
  let mockPracticeFacade;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockRemovePracticeQuizDialogService = {
      quizToRemove$: new BehaviorSubject<Quiz | undefined>(undefined),
    };
    mockPracticeFacade = {};

    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemovePracticeQuizComponent],
      providers: [
        {
          provide: RemovePracticeQuizDialogService,
          useValue: mockRemovePracticeQuizDialogService,
        },
        { provide: PracticeFacade, useValue: mockPracticeFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardRemovePracticeQuizComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe and update quizToRemove$ from service', () => {
    const mockQuiz: Quiz = {
      id: '1',
      name: 'Test quiz',
      slug: 'test-quiz-slug',
      items: [],
    } as unknown as Quiz;

    mockRemovePracticeQuizDialogService.quizToRemove$.next(mockQuiz);

    fixture.detectChanges();

    component.quizToRemove$.subscribe((quiz) => {
      expect(quiz).toEqual(mockQuiz);
    });
  });
});
