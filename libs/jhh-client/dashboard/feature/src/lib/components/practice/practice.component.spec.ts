import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PracticeComponent } from './practice.component';

describe('PracticeComponent', () => {
  let component: PracticeComponent;
  let fixture: ComponentFixture<PracticeComponent>;
  let mockActivatedRoute;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [PracticeComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeComponent);
    component = fixture.componentInstance;
    component.quizzes = [
      {
        id: '1',
        name: 'Angular Basics',
        description: 'Introduction to Angular concepts and practices',
        items: [],
        slug: 'angular-basics',
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display quizzes if provided', () => {
    fixture.detectChanges();

    const quizElements = fixture.nativeElement.querySelectorAll('li');
    expect(quizElements.length).toBeGreaterThan(0);
    expect(quizElements[0].textContent).toContain('Angular Basics');
  });

  it('should display "No quizzes found." if quizzes are empty', () => {
    component.quizzes = [];
    fixture.detectChanges();

    const emptyListText =
      fixture.nativeElement.querySelector('.box p').textContent;
    expect(emptyListText).toContain('No quizzes found.');
  });

  it('should display "Add quiz" link if no quizzes are provided', () => {
    component.quizzes = [];
    fixture.detectChanges();

    const addQuizLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(addQuizLink.textContent).toContain('Add quiz');
  });

  it('should display "See more" link if quizzes are provided', () => {
    component.quizzes = [
      {
        id: '2',
        name: 'React Fundamentals',
        description: 'Learn the basics of React',
        items: [],
        slug: 'react-fundamentals',
      },
    ] as any;
    fixture.detectChanges();

    const seeMoreLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(seeMoreLink.textContent).toContain('See more');
  });
});
