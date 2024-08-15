import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { JhhClientDashboardEditPracticeQuizComponent } from './jhh-client-dashboard-edit-practice-quiz.component';

describe('JhhClientDashboardEditPracticeQuizComponent', () => {
  let component: JhhClientDashboardEditPracticeQuizComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditPracticeQuizComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditPracticeQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardEditPracticeQuizComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
