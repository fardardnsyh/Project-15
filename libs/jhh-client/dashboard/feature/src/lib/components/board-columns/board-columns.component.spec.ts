import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BoardColumnsComponent } from './board-columns.component';

describe('BoardColumnsComponent', () => {
  let component: BoardColumnsComponent;
  let fixture: ComponentFixture<BoardColumnsComponent>;
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
      imports: [BoardColumnsComponent, NoopAnimationsModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardColumnsComponent);
    component = fixture.componentInstance;
    component.columns = [
      {
        name: 'Todo',
        color: '#e55039',
        items: [{ content: 'Task 1' }, { content: 'Task 2' }],
      },
    ] as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display columns if provided', () => {
    fixture.detectChanges();
    const titleElements = fixture.nativeElement.querySelectorAll(
      'mat-panel-title span'
    );
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[1].textContent).toContain('Todo');
  });

  it('should display "No board columns found." if columns are empty', () => {
    component.columns = [];
    fixture.detectChanges();

    const emptyListText =
      fixture.nativeElement.querySelector('.box p').textContent;
    expect(emptyListText).toContain('No board columns found.');
  });

  it('should display "See more" link if columns are provided', () => {
    component.columns = [{ name: 'Todo', color: '#e55039', items: [] }] as any;
    fixture.detectChanges();

    const seeMoreLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(seeMoreLink.textContent).toContain('See more');
  });

  it('should display "Add column" link if no columns are provided', () => {
    component.columns = [];
    fixture.detectChanges();

    const addColumnLink = fixture.nativeElement.querySelector('.seeMore a');
    expect(addColumnLink.textContent).toContain('Add column');
  });
});
