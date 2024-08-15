import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { BehaviorSubject, of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ControlsComponent } from './controls.component';

import { EditPracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-edit-quiz';
import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';

import { provideMockStore } from '@ngrx/store/testing';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;
  let mockPracticeFacade: Partial<PracticeFacade>;
  let mockEditPracticeQuizDialogService: Partial<EditPracticeQuizDialogService>;
  let mockRemovePracticeQuizDialogService: Partial<RemovePracticeQuizDialogService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockPracticeFacade = {
      editQuizSuccess$: of(false),
      removeQuizSuccess$: of(false),
      getQuizSlug$ById: jest.fn().mockReturnValue(of('newSlug')),
    };

    mockEditPracticeQuizDialogService = { openDialog: jest.fn() };
    mockRemovePracticeQuizDialogService = { openDialog: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ControlsComponent, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        {
          provide: EditPracticeQuizDialogService,
          useValue: mockEditPracticeQuizDialogService,
        },
        {
          provide: RemovePracticeQuizDialogService,
          useValue: mockRemovePracticeQuizDialogService,
        },
        { provide: PracticeFacade, useValue: mockPracticeFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    component.isQuizShuffled$ = new BehaviorSubject<boolean>(false);
    component.questionsLimit$ = new BehaviorSubject<number>(0);
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

  it('should call openDialog on editPracticeQuizDialogService when openEditQuizDialog is called', () => {
    component.openEditQuizDialog();
    expect(mockEditPracticeQuizDialogService.openDialog).toHaveBeenCalledWith(
      component.quiz
    );
  });

  it('should call openDialog on removePracticeQuizDialogService when openRemoveQuizDialog is called', () => {
    component.openRemoveQuizDialog();
    expect(mockRemovePracticeQuizDialogService.openDialog).toHaveBeenCalledWith(
      component.quiz
    );
  });

  it('should reset shuffle and question limit when play dialog is closed', () => {
    component.openPlayDialog();
    component.dialogRef.close();

    fixture.detectChanges();

    component.isQuizShuffled$.subscribe((shuffle) => {
      expect(shuffle).toBe(false);
    });

    component.questionsLimit$.subscribe((limit) => {
      expect(limit).toBe(0);
    });
  });
});
