import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockPracticeFacade: Partial<PracticeFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockPracticeFacade = {
      editQuizInProgress$: of(false),
      editQuizError$: of(null),
      editQuizSuccess$: of(false),
      editQuiz: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: PracticeFacade, useValue: mockPracticeFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.quiz = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'quiz',
      slug: 'quiz-slug',
      description: 'description',
      imageUrl:
        'https://preview.redd.it/k8kfrqd815s61.jpg?auto=webp&s=075d53130cf1d1252fb11d7d3078cd34e4647670',
      items: [
        {
          question: 'What is TypeScript primarily used for?',
          answers: [
            { isCorrect: false, text: 'Back-end development' },
            { isCorrect: true, text: 'Adding static typing to JavaScript' },
          ],
        },
        {
          question:
            'Which of the following is a valid way to define a variable in TypeScript?',
          answers: [
            { isCorrect: true, text: 'var name: string = "John";' },
            { isCorrect: false, text: 'string name = "John";' },
          ],
        },
      ],
      results: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog on ngAfterViewInit', () => {
    const openSpy = jest.spyOn(component['dialog'], 'open');
    component.ngAfterViewInit();
    expect(openSpy).toHaveBeenCalledWith(component['dialogContent']);
  });

  it('should call editQuiz on form submit if form is valid', () => {
    const itemsValue = [
      {
        question: 'Example Question',
        answers: [
          { text: 'Answer 1', isCorrect: true },
          { text: 'Answer 2', isCorrect: false },
        ],
      },
      {
        question: 'Example Question 2',
        answers: [
          { text: 'Answer 2.1', isCorrect: false },
          { text: 'Answer 2.2', isCorrect: true },
        ],
      },
    ];

    component.formGroup.setValue({
      name: 'Test Quiz',
      slug: 'test-quiz-slug',
      description: 'Test Description',
      imageUrl: '',
      items: itemsValue,
    });

    component.onSubmit();

    expect(mockPracticeFacade.editQuiz).toHaveBeenCalled();
  });

  it('should not call editQuiz if form is invalid', () => {
    const itemsValue = [
      {
        question: 'Example Question',
        answers: [
          { text: 'Answer 1', isCorrect: true },
          { text: 'Answer 2', isCorrect: false },
        ],
      },
      {
        question: 'Example Question 2',
        answers: [
          { text: 'Answer 2.1', isCorrect: false },
          { text: 'Answer 2.2', isCorrect: true },
        ],
      },
    ];

    component.formGroup.setValue({
      name: '',
      slug: 'test-quiz-slug',
      description: 'Test Description',
      imageUrl: '',
      items: itemsValue,
    });

    component.onSubmit();

    expect(mockPracticeFacade.editQuiz).not.toHaveBeenCalled();
  });
});
