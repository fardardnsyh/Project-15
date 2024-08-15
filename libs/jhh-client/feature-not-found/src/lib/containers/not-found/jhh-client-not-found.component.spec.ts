import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute } from '@angular/router';

import { JhhClientNotFoundComponent } from './jhh-client-not-found.component';

describe('JhhClientNotFoundComponent', () => {
  let component: JhhClientNotFoundComponent;
  let fixture: ComponentFixture<JhhClientNotFoundComponent>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    mockActivatedRoute = {};

    await TestBed.configureTestingModule({
      imports: [JhhClientNotFoundComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
