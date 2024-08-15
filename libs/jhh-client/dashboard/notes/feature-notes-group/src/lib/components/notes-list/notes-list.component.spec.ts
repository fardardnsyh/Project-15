import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

import { NotesListComponent } from './notes-list.component';
import { ActionResolverService } from '@jhh/jhh-client/shared/util-ngrx';

describe('NotesListComponent', () => {
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;
  let mockActionResolverService: { executeAndWatch: jest.Mock<any, any, any> };
  let mockActivatedRoute;

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

    mockActivatedRoute = {
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [NotesListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        [provideMockStore({})],
        { provide: ActionResolverService, useValue: mockActionResolverService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breakpoint observable', () => {
    expect(component.breakpoint$).toBeInstanceOf(Observable);
  });

  it('should display "No notes found." when sortedNotes is empty', () => {
    component.sortedNotes = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      'No notes found.'
    );
  });
});
