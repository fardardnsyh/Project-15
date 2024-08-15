import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { RelatedNotesComponent } from './related-notes.component';

import { Note } from '@jhh/shared/domain';

describe('RelatedNotesComponent', () => {
  let component: RelatedNotesComponent;
  let routerMock: jest.Mocked<Router>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    jest.useFakeTimers();
    routerMock = {
      navigate: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [RelatedNotesComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RelatedNotesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to related note', async () => {
    const note: Note = { id: '1', slug: 'note-1' } as Note;
    await component.navigateToRelatedNote(note);

    expect(routerMock.navigate).toHaveBeenCalledWith([''], {
      skipLocationChange: true,
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['../', note.slug], {
      relativeTo: {},
    });
  });
});
