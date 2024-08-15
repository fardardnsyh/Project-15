import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardSearchbarComponent } from './jhh-client-dashboard-searchbar.component';
import { InputComponent } from '../../components/input/input.component';
import { ResultsComponent } from '../../components/results/results.component';

describe('JhhClientDashboardSearchbarComponent', () => {
  let component: JhhClientDashboardSearchbarComponent;
  let fixture: ComponentFixture<JhhClientDashboardSearchbarComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CommonModule,
        JhhClientDashboardSearchbarComponent,
        InputComponent,
        ResultsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle search query', (done) => {
    const testQuery: string = 'test';
    const mockResults: string[] = ['result1', 'result2'];

    component.searchFunction = jest.fn().mockReturnValue(of(mockResults));

    component.results$.subscribe((results) => {
      expect(results).toEqual(mockResults);
      done();
    });

    component.onSearch(testQuery);
  });

  it('should set loading and searchStarted flags', () => {
    const testQuery: string = 'test';
    component.onSearch(testQuery);

    expect(component.loading).toBe(true);
    expect(component.searchStarted).toBe(true);
  });
});
