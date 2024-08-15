import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { EditPracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-edit-quiz';
import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';

import { QuizzesListComponent } from './quizzes-list.component';

import { QuizResults } from '@jhh/shared/domain';

describe('QuizzesListComponent', () => {
  let component: QuizzesListComponent;
  let fixture: ComponentFixture<QuizzesListComponent>;
  let mockEditPracticeQuizDialogService: any;
  let mockRemovePracticeQuizDialogService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockEditPracticeQuizDialogService = { openDialog: jest.fn() };
    mockRemovePracticeQuizDialogService = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [QuizzesListComponent],
      providers: [
        {
          provide: EditPracticeQuizDialogService,
          useValue: mockEditPracticeQuizDialogService,
        },
        {
          provide: RemovePracticeQuizDialogService,
          useValue: mockRemovePracticeQuizDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizzesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breakpoint observable', () => {
    expect(component.breakpoint$).toBeInstanceOf(Observable);
  });

  it('should call extendQuizzes when quizzes input changes', () => {
    const spyExtendQuizzes = jest.spyOn(component as any, 'extendQuizzes');

    component.quizzes = [
      { id: 'test-quiz', name: 'Test Quiz', items: [], results: [] },
    ] as any;

    const changesObj = {
      quizzes: {
        currentValue: component.quizzes,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    };

    component.ngOnChanges(changesObj as any);
    expect(spyExtendQuizzes).toHaveBeenCalled();
  });

  it('should extend quizzes with passRate and percentageClass', () => {
    component.quizzes = [
      {
        id: 'quiz1',
        name: 'Quiz 1',
        items: [],
        results: [{ percentage: 80 }, { percentage: 90 }],
      } as any,
    ];

    const changesObj = {
      quizzes: {
        currentValue: component.quizzes,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    };

    component.ngOnChanges(changesObj as any);

    expect(component.extendedQuizzes[0].passRate).toBe(85);
    expect(component.extendedQuizzes[0].percentageClass).toBeDefined();
  });

  it('should call openDialog on EditPracticeQuizDialogService with the quiz', () => {
    const testQuiz = {
      id: 'quiz1',
      name: 'Quiz 1',
      items: [],
      results: [],
    };
    component.openEditQuizDialog(testQuiz as any);
    expect(mockEditPracticeQuizDialogService.openDialog).toHaveBeenCalledWith(
      testQuiz
    );
  });

  it('should call openDialog on RemovePracticeQuizDialogService with the quiz', () => {
    const testQuiz = {
      id: 'quiz2',
      name: 'Quiz 2',
      items: [],
      results: [],
    };
    component.openRemoveQuizDialog(testQuiz as any);
    expect(mockRemovePracticeQuizDialogService.openDialog).toHaveBeenCalledWith(
      testQuiz
    );
  });

  it('should calculate pass rate correctly', () => {
    const results = [{ percentage: 70 }, { percentage: 90 }] as QuizResults[];
    const passRate = component['calculatePassRate'](results);
    expect(passRate).toBe(80);
  });

  it('should return null if there are no results', () => {
    const results: any[] = [];
    const passRate = component['calculatePassRate'](results);
    expect(passRate).toBeNull();
  });
});
