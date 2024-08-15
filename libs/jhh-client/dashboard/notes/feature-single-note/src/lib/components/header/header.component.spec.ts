import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Note } from '@jhh/shared/domain';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockNote: Note;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    mockNote = {
      id: '1',
      name: 'Test Note',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-02'),
    } as Note;

    component.note = mockNote;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the note name', () => {
    const nameElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(nameElement.textContent).toContain(mockNote.name);
  });

  it('should display the creation date', () => {
    const creationDateElement = fixture.debugElement.queryAll(
      By.css('.noteHeader__date')
    )[0].nativeElement;
    expect(creationDateElement.textContent.includes('01.01.2020')).toBeTruthy();
  });

  it('should display the updated date if different from created date', () => {
    const updateDateElement = fixture.debugElement.queryAll(
      By.css('.noteHeader__date')
    )[1].nativeElement;
    expect(updateDateElement).toBeTruthy();
    expect(updateDateElement.textContent.includes('02.01.2020')).toBeTruthy();
  });
});
