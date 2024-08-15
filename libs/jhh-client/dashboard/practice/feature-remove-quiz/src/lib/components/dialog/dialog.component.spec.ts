import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { DialogComponent } from './dialog.component';

import { Quiz } from '@jhh/shared/domain';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';
import { RemovePracticeQuizDialogService } from '../../services/remove-practice-quiz-dialog.service';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockPracticeFacade: any, mockRemovePracticeQuizDialogService: any;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockPracticeFacade = {
      removeQuizInProgress$: of(false),
      removeQuizError$: of(null),
      removeQuiz: jest.fn(),
    };
    mockRemovePracticeQuizDialogService = {
      clearQuizToRemove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        { provide: PracticeFacade, useValue: mockPracticeFacade },
        {
          provide: RemovePracticeQuizDialogService,
          useValue: mockRemovePracticeQuizDialogService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.quiz = {
      id: '1337',
      name: 'Test Quiz',
      items: [],
    } as unknown as Quiz;
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

  it('should handle remove correctly', () => {
    component.handleRemove();
    expect(mockPracticeFacade.removeQuiz).toHaveBeenCalledWith(
      component.quiz.id
    );
  });
});
