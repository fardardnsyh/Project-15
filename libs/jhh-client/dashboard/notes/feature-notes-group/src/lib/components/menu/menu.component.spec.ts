import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';

import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';
import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';
import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { MenuComponent } from './menu.component';

import { NotesGroup } from '@jhh/shared/domain';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockActivatedRoute,
    mockRouter,
    mockDestroyRef,
    mockEditNotesGroupDialogService: Partial<EditNotesGroupDialogService>,
    mockRemoveNotesGroupDialogService: Partial<RemoveNotesGroupDialogService>,
    mockNotesFacade: Partial<NotesFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = { queryParams: of({}) };
    mockRouter = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
      url: '/current/url',
    };
    mockDestroyRef = {};
    mockEditNotesGroupDialogService = { openDialog: jest.fn() };
    mockRemoveNotesGroupDialogService = { openDialog: jest.fn() };
    mockNotesFacade = {
      editNotesGroupSuccess$: of(true),
      removeNotesGroupSuccess$: of(true),
      getGroupSlug$ByGroupId: jest.fn().mockReturnValue(of('slug')),
      duplicateNotesGroup: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: DestroyRef, useValue: mockDestroyRef },
        {
          provide: EditNotesGroupDialogService,
          useValue: mockEditNotesGroupDialogService,
        },
        {
          provide: RemoveNotesGroupDialogService,
          useValue: mockRemoveNotesGroupDialogService,
        },
        { provide: NotesFacade, useValue: mockNotesFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    const group: NotesGroup = {
      id: 'testId',
      name: 'group',
    } as NotesGroup;
    component.group = group;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to editNotesGroupSuccess$ and handle navigation', (done) => {
    mockNotesFacade.editNotesGroupSuccess$ = of(true);
    component.ngOnInit();
    component.editNotesGroupSuccess$.subscribe((success) => {
      expect(success).toBeTruthy();
      done();
    });
  });

  it('should subscribe to removeNotesGroupSuccess$ and handle navigation', (done) => {
    mockNotesFacade.removeNotesGroupSuccess$ = of(true);
    component.ngOnInit();
    component.removeNotesGroupSuccess$.subscribe((success) => {
      expect(success).toBeTruthy();
      done();
    });
  });

  it('should call openDialog on EditNotesGroupDialogService with the group when openEditNotesGroupDialog is called', () => {
    component.openEditNotesGroupDialog();
    expect(mockEditNotesGroupDialogService.openDialog).toHaveBeenCalledWith(
      component.group
    );
  });

  it('should call openDialog on RemoveNotesGroupDialogService with the group when openRemoveNotesGroupDialog is called', () => {
    component.openRemoveNotesGroupDialog();
    expect(mockRemoveNotesGroupDialogService.openDialog).toHaveBeenCalledWith(
      component.group
    );
  });

  it('should call duplicateNotesGroup with the correct group id', () => {
    component.handleDuplicate();
    expect(mockNotesFacade.duplicateNotesGroup).toHaveBeenCalledWith('testId');
  });
});
