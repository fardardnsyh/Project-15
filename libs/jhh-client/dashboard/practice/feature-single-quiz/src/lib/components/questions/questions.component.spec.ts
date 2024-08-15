import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { QuestionsComponent } from './questions.component';

import { QuizItem } from '@jhh/shared/domain';

describe('QuestionsComponent', () => {
  let component: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  const mockQuestions: QuizItem[] = [
    {
      question: 'What is Angular?',
      answers: [
        { text: 'A front-end framework', isCorrect: true },
        { text: 'A programming language', isCorrect: false },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionsComponent);
    component = fixture.componentInstance;
    component.questions = mockQuestions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly display questions and answers', () => {
    fixture.detectChanges();

    const questionElements = fixture.nativeElement.querySelectorAll(
      'mat-expansion-panel-header'
    );
    expect(questionElements.length).toBe(mockQuestions.length);
    expect(questionElements[0].textContent).toContain(
      mockQuestions[0].question
    );
  });

  it('should toggle accordion on button click', () => {
    expect(component.isAccordionOpen).toBe(false);

    component.toggleAccordion();
    fixture.detectChanges();

    expect(component.isAccordionOpen).toBe(true);
  });

  it('should display "No questions found." when no questions are provided', () => {
    component.questions = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      'No questions found.'
    );
  });
});
