import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
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
      imports: [NotesComponent, NoopAnimationsModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    component.groups = [
      {
        name: 'Personal',
        slug: 'personal',
        notes: [
          { name: 'Shopping List', slug: 'shopping-list' },
          { name: 'Books to Read', slug: 'books-to-read' },
        ],
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notes groups if provided', () => {
    const titleElements = fixture.nativeElement.querySelectorAll(
      'mat-panel-title span'
    );
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[1].textContent).toContain('Personal');
  });

  it('should display "No notes groups found." if groups are empty', () => {
    component.groups = [];
    fixture.detectChanges();

    const emptyListText =
      fixture.nativeElement.querySelector('.box p').textContent;
    expect(emptyListText).toContain('No notes groups found.');
  });

  it('should display "Add group" link if no groups are provided', () => {
    component.groups = [];
    fixture.detectChanges();

    const addGroupLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(addGroupLink.textContent).toContain('Add group');
  });

  it('should display "See more" link if groups are provided', () => {
    component.groups = [{ name: 'Work', slug: 'work', notes: [] }] as any;
    fixture.detectChanges();

    const seeMoreLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(seeMoreLink.textContent).toContain('See more');
  });
});
