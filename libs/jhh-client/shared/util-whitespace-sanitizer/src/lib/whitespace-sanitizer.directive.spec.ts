import { Component, DebugElement, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhitespaceSanitizerDirective } from './whitespace-sanitizer.directive';
import { NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

@Component({
  template: `<input type="text" [whitespaceSanitizer] />`,
})
class TestHostComponent {}

@Injectable()
class MockNgControl extends NgControl {
  control = null;
  override valueAccessor: any = null;

  viewToModelUpdate(newValue: any): void {}
}

describe('WhitespaceSanitizerDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: DebugElement;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WhitespaceSanitizerDirective],
      declarations: [TestHostComponent],
      providers: [{ provide: NgControl, useClass: MockNgControl }],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(
      By.directive(WhitespaceSanitizerDirective)
    );
    fixture.detectChanges();
  });

  it('should create an instance of the directive', () => {
    expect(inputEl).not.toBeNull();
  });
});
