import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

import { JhhClientDashboardNoteCardComponent } from './jhh-client-dashboard-note-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { UpdatedAtComponent } from '../../components/updated-at/updated-at.component';
import { MenuComponent } from '../../components/menu/menu.component';

import { Note, NotesGroup } from '@jhh/shared/domain';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

describe('JhhClientDashboardNoteCardComponent', () => {
  let component: JhhClientDashboardNoteCardComponent;
  let fixture: ComponentFixture<JhhClientDashboardNoteCardComponent>;
  let mockNote: Note;
  let notesFacadeMock: Partial<NotesFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    notesFacadeMock = {
      getGroups$: () => of([{}] as NotesGroup[]),
    };

    await TestBed.configureTestingModule({
      imports: [
        JhhClientDashboardNoteCardComponent,
        HeaderComponent,
        UpdatedAtComponent,
        MenuComponent,
        RouterTestingModule,
      ],
      providers: [{ provide: NotesFacade, useValue: notesFacadeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNoteCardComponent);
    component = fixture.componentInstance;

    mockNote = {
      id: '1',
      name: 'name',
      slug: 'slug',
    } as Note;
    component.note = mockNote;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display note details', () => {
    const headerComponent = fixture.debugElement.query(
      By.directive(HeaderComponent)
    );
    const updatedAtComponent = fixture.debugElement.query(
      By.directive(UpdatedAtComponent)
    );
    const menuComponent = fixture.debugElement.query(
      By.directive(MenuComponent)
    );

    expect(headerComponent).toBeTruthy();
    expect(updatedAtComponent).toBeTruthy();
    expect(menuComponent).toBeTruthy();
  });
});
