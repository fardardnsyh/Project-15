import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from './dialog.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { EditNotesGroupDialogService } from '../../services/edit-notes-group-dialog.service';

import { NotesGroup } from '@jhh/shared/domain';
import { NotesGroupFormField } from '@jhh/jhh-client/dashboard/notes/domain';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockNotesFacade: Partial<NotesFacade>;
  let mockEditNotesGroupDialogService: Partial<EditNotesGroupDialogService>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockNotesFacade = {
      editNotesGroupInProgress$: of(false),
      editNotesGroupError$: of(null),
      editNotesGroup: jest.fn(),
      resetErrors: jest.fn(),
    };

    mockEditNotesGroupDialogService = {
      clearNotesGroupToEdit: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: NotesFacade, useValue: mockNotesFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.groupToEdit = {
      id: 'mockGroupId',
      name: 'mockGroupName',
      slug: 'mockGroupSlug',
    } as NotesGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with groupToEdit values', () => {
    fixture.detectChanges();

    const nameControl = component.formGroup.get(NotesGroupFormField.Name);
    const slugControl = component.formGroup.get(NotesGroupFormField.Slug);

    expect(nameControl!.value).toBe('mockGroupName');
    expect(slugControl!.value).toBe('mockGroupSlug');
  });

  it('should open the dialog on ngAfterViewInit', () => {
    const openSpy = jest.spyOn(component['dialog'], 'open');
    component.ngAfterViewInit();
    expect(openSpy).toHaveBeenCalledWith(component['dialogContent']);
  });

  it('should call editNotesGroup with correct parameters on form submit', () => {
    component.formGroup.controls[component.formField.Name].setValue('New Name');
    component.formGroup.controls[component.formField.Slug].setValue('new-slug');
    component.onSubmit();
    expect(mockNotesFacade.editNotesGroup).toHaveBeenCalledWith(
      component.groupToEdit.id,
      'New Name',
      'new-slug'
    );
  });
});
