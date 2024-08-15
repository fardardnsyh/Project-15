import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { HeaderComponent } from './header.component';

import { StripHtmlPipe } from '@jhh/jhh-client/shared/pipes';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, StripHtmlPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display name', () => {
    const testName: string = 'Test Name';
    component.name = testName;
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('h3');
    expect(nameElement.textContent).toContain(testName);
  });

  it('should apply StripHtmlPipe to content', () => {
    const testContent: string = '<p>Some <b>bold</b> text</p>';
    component.content = testContent;
    fixture.detectChanges();

    const contentElement = fixture.nativeElement.querySelector('p');
    expect(contentElement.textContent).not.toContain('<b>');
    expect(contentElement.textContent).toContain('Some bold text');
  });
});
