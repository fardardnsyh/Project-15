import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';

import { ResultsComponent } from './results.component';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule, RouterTestingModule, ResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display results when provided', () => {
    component.results = [{ id: 1, name: 'Item 1', slug: '/item-1' }];
    component.searchStarted = true;
    fixture.detectChanges();

    const listItemElements =
      fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(listItemElements.length).toBe(1);
    expect(listItemElements[0].textContent).toContain('Item 1');
  });

  it('should display "No results found" when no results are provided', () => {
    component.results = [];
    component.searchStarted = true;
    fixture.detectChanges();

    const noResultsElement =
      fixture.nativeElement.querySelector('.results__noFound');
    expect(noResultsElement.textContent).toContain('No results found');
  });

  it('should display "Searching..." when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingElement =
      fixture.nativeElement.querySelector('.results__loading');
    expect(loadingElement.textContent).toContain('Searching...');
  });
});
