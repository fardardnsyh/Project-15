import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display name', () => {
    component.name = 'Quiz Name';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Quiz Name');
  });

  it('should conditionally display an image if imageUrl is provided', () => {
    component.imageUrl = 'http://example.com/image.jpg';
    component.name = 'Quiz Name';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('img')).toBeTruthy();
    expect(compiled.querySelector('img').src).toBe(
      'http://example.com/image.jpg'
    );
  });

  it('should not display an image if imageUrl is not provided', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('img')).toBeNull();
  });

  it('should conditionally display a description if provided', () => {
    component.description = 'This is a quiz description.';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(
      'This is a quiz description.'
    );
  });

  it('should not display a description if not provided', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p')).toBeNull();
  });
});
