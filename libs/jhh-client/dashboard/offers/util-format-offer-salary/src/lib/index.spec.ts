import '@angular/compiler';
import { CurrencyPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { FormatOfferSalaryPipe } from '.';

import { OfferSalaryCurrency } from '@jhh/shared/domain';

describe('FormatOfferSalaryPipe', () => {
  let pipe: FormatOfferSalaryPipe;
  let currencyPipe: CurrencyPipe;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyPipe],
    });
    currencyPipe = TestBed.inject(CurrencyPipe);
    pipe = new FormatOfferSalaryPipe(currencyPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format salary with both min and max salary', () => {
    const salaryInfo = {
      minSalary: 50000,
      maxSalary: 70000,
      salaryCurrency: OfferSalaryCurrency.USD,
    };
    const expectedFormat = `${currencyPipe.transform(
      salaryInfo.minSalary,
      'USD',
      'symbol',
      '1.0-0'
    )} - ${currencyPipe.transform(
      salaryInfo.maxSalary,
      'USD',
      'symbol',
      '1.0-0'
    )}`;
    expect(pipe.transform(salaryInfo)).toBe(expectedFormat);
  });

  it('should format salary with only min salary', () => {
    const salaryInfo = {
      minSalary: 50000,
      salaryCurrency: OfferSalaryCurrency.USD,
    };
    const expectedFormat = currencyPipe.transform(
      salaryInfo.minSalary,
      'USD',
      'symbol',
      '1.0-0'
    );
    expect(pipe.transform(salaryInfo)).toBe(expectedFormat);
  });

  it('should format salary with only max salary', () => {
    const salaryInfo = {
      maxSalary: 70000,
      salaryCurrency: OfferSalaryCurrency.EUR,
    };
    const expectedFormat = currencyPipe.transform(
      salaryInfo.maxSalary,
      'EUR',
      'symbol',
      '1.0-0'
    );
    expect(pipe.transform(salaryInfo)).toBe(expectedFormat);
  });

  it('should return "-" when no salary is provided', () => {
    const salaryInfo = {};
    expect(pipe.transform(salaryInfo)).toBe('-');
  });
});
