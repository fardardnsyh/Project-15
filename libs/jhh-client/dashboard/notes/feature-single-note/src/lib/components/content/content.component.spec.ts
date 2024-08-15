import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let sanitizer: DomSanitizer;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: jest
              .fn()
              .mockImplementation((html) => html),
          },
        },
      ],
    }).compileComponents();

    sanitizer = TestBed.inject(DomSanitizer);
    component = TestBed.createComponent(ContentComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sanitizeContent when content changes', () => {
    component.content = '<p>Test HTML Content</p>';
    component.ngOnChanges({
      content: {
        currentValue: component.content,
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
      component.content
    );
  });

  it('should update sanitizedContent when content changes', () => {
    const testHtml: string = '<p>Test HTML Content</p>';
    component.content = testHtml;
    component.ngOnChanges({
      content: {
        currentValue: component.content,
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(component.sanitizedContent).toBe(testHtml);
  });
});
