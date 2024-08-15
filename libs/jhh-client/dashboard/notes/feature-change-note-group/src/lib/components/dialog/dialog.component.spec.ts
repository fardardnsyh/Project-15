import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from '../../components/dialog/dialog.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { Note } from '@jhh/shared/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: Partial<NotesFacade>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      changeNoteGroupInProgress$: of(false),
      changeNoteGroupError$: of(null),
      getGroups$: (excludeId?: string) => of([]),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: NotesFacade, useValue: mockNotesFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.noteToMove = { id: 'mockNoteId', groupId: 'mockGroupId' } as Note;

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

  it('should initialize form group with new group name field', () => {
    TestBed.runInInjectionContext(() => {
      component.noteToMove = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Note 1',
        slug: 'note-1',
        content: 'This is note 1',
        groupId: 'group-1',
      };
      component.ngOnInit();
      expect(
        component.formGroup.get(component.formField.NewGroupName)
      ).toBeDefined();
    });
  });
});
