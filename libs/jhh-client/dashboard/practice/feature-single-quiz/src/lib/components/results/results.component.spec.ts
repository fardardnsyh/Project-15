import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { MatDialog } from '@angular/material/dialog';

import { ResultsComponent } from './results.component';

import { QuizResult, QuizResults } from '@jhh/shared/domain';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let mockDialog: jest.Mocked<MatDialog>;

  const mockQuizResults: QuizResult[] = [
    {
      question: 'What is the capital of France?',
      userAnswers: ['Paris'],
      correctAnswers: ['Paris'],
      isCorrect: true,
    },
    {
      question: 'What does CSS stand for?',
      userAnswers: ['Cascading Style Sheets'],
      correctAnswers: ['Cascading Style Sheets'],
      isCorrect: false,
    },
  ];

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn().mockReturnThis(),
      afterClosed: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockImplementation((fn) => fn()),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    component.results = [
      {
        percentage: 50,
        totalScore: 1,
        items: mockQuizResults,
      } as QuizResults,
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly initialize extendedResults', () => {
    expect(component.extendedResults.length).toBe(component.results.length);
  });

  it('should display the default number of items initially', () => {
    const displayedResults = fixture.nativeElement.querySelectorAll('li');
    expect(displayedResults.length).toBeLessThanOrEqual(
      component.defaultDisplayedItems
    );
  });

  it('should toggle displayedItems on toggleList call', () => {
    const initialDisplayedItems = component.displayedItems;
    component.toggleList();
    fixture.detectChanges();
    expect(component.displayedItems).not.toBe(initialDisplayedItems);
  });
});
