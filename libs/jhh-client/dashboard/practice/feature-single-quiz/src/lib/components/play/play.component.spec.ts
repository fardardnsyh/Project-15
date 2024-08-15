import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

import { PlayComponent } from './play.component';

describe('PlayComponent', () => {
  let component: PlayComponent;
  let fixture: ComponentFixture<PlayComponent>;
  let mockActionResolverService: Partial<ActionResolverService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActionResolverService = {
      executeAndWatch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PlayComponent],
      providers: [
        provideMockStore(),
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayComponent);
    component = fixture.componentInstance;
    component.quiz = {
      id: '1',
      name: 'Sample Quiz',
      items: [
        {
          question: 'Question 1',
          answers: [
            { text: 'Answer 1', isCorrect: true },
            { text: 'Answer 2', isCorrect: false },
          ],
        },
        {
          question: 'Question 2',
          answers: [
            { text: 'Answer 1', isCorrect: false },
            { text: 'Answer 2', isCorrect: true },
          ],
        },
      ],
    } as any;
    component.isPlayMode$ = new BehaviorSubject<boolean>(true);
    component.isQuizShuffled$ = new BehaviorSubject<boolean>(false);
    component.questionsLimit$ = new BehaviorSubject<number>(2);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    expect(component.currentQuestionIndex).toBe(0);
    expect(component.selectedAnswers.size).toBe(0);
    expect(component.shuffledAndLimitedQuestions.length).toBe(2);
  });

  it('should handle answer selection for single-choice questions', () => {
    component.onSelectAnswer(0, 'Answer 1');
    fixture.detectChanges();

    expect(component.selectedAnswers.get(0)).toEqual(['Answer 1']);
  });

  it('should limit questions according to questionsLimit$', () => {
    const limit = 1;
    component.questionsLimit$.next(limit);
    component.ngOnInit();
    expect(component.shuffledAndLimitedQuestions.length).toBe(limit);
  });

  it('should navigate to next and previous question', () => {
    component.nextQuestion();
    expect(component.currentQuestionIndex).toBe(1);

    component.previousQuestion();
    expect(component.currentQuestionIndex).toBe(0);
  });

  it('should correctly calculate quiz results on submission', () => {
    component.onSelectAnswer(0, 'Answer 1');
    component.onSelectAnswer(1, 'Answer 2');
    component.onSubmitQuiz();

    expect(component.quizResults.length).toBe(
      component.shuffledAndLimitedQuestions.length
    );
    expect(component.totalScore).toBe(2);
    expect(component.percentage).toBe(100);
  });

  it('should reset the quiz on playAgain', () => {
    component.onSelectAnswer(0, 'Answer 1');
    component.currentQuestionIndex = 1;
    component.onSubmitQuiz();

    component.playAgain();

    expect(component.currentQuestionIndex).toBe(0);
    expect(component.selectedAnswers.size).toBe(0);
    expect(component.quizResults).toEqual([]);
  });
});
