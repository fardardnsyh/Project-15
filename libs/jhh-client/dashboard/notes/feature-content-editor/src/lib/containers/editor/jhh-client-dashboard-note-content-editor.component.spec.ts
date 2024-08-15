import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardNoteContentEditorComponent } from './jhh-client-dashboard-note-content-editor.component';
import { WysiwygComponent } from '../../components/wysiwyg/wysiwyg.component';

describe('JhhClientDashboardNoteContentEditorComponent', () => {
  let component: JhhClientDashboardNoteContentEditorComponent;
  let fixture: ComponentFixture<JhhClientDashboardNoteContentEditorComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        JhhClientDashboardNoteContentEditorComponent,
        WysiwygComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      JhhClientDashboardNoteContentEditorComponent
    );
    component = fixture.componentInstance;
    component.contentControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editorCreated event when handleEditorCreated is called', () => {
    jest.spyOn(component.editorCreated, 'emit');
    const mockQuillInstance = {};
    component.handleEditorCreated(mockQuillInstance);
    expect(component.editorCreated.emit).toHaveBeenCalledWith(
      mockQuillInstance
    );
  });
});
