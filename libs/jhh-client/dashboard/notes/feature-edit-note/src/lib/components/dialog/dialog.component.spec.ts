import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DialogComponent } from './dialog.component';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NoteFormField } from '@jhh/jhh-client/dashboard/notes/domain';

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
      editNoteInProgress$: of(false),
      editNoteError$: of(null),
      editNote: jest.fn(),
    };

    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      value: jest.fn(),
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [DialogComponent, NoopAnimationsModule],
      providers: [{ provide: NotesFacade, useValue: mockNotesFacade }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    component.noteToEdit = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'note',
      slug: 'note-slug',
      content: 'content',
      groupId: '2',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with noteToEdit values', () => {
    fixture.detectChanges();

    const nameControl = component.formGroup.get(NoteFormField.Name);
    const slugControl = component.formGroup.get(NoteFormField.Slug);
    const contentControl = component.formGroup.get(NoteFormField.Content);

    expect(nameControl!.value).toBe('note');
    expect(slugControl!.value).toBe('note-slug');
    expect(contentControl!.value).toBe('content');
  });

  it('should open the dialog on ngAfterViewInit', () => {
    const openSpy = jest.spyOn(component['dialog'], 'open');
    component.ngAfterViewInit();
    expect(openSpy).toHaveBeenCalledWith(component['dialogContent']);
  });

  it('should call editNote with correct parameters on form submit', () => {
    component.formGroup.controls[component.formField.Name].setValue('New Name');
    component.formGroup.controls[component.formField.Slug].setValue('new-slug');
    component.formGroup.controls[component.formField.Content].setValue(
      '<h1>heading</h1>'
    );
    component.onSubmit();
    expect(mockNotesFacade.editNote).toHaveBeenCalledWith(
      component.noteToEdit.id,
      'New Name',
      'new-slug',
      '<h1>heading</h1>',
      component.noteToEdit.groupId
    );
  });
});
