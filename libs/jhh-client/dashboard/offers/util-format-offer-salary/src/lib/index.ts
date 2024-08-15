import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'formatOfferSalary',
  standalone: true,
})
export class FormatOfferSalaryPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(element: any): string {
    const formatSalary = (salary: number): string =>
      this.currencyPipe.transform(
        salary,
        element.salaryCurrency,
        'symbol',
        '1.0-0'
      )!;

    return element.minSalary && element.maxSalary
      ? `${formatSalary(element.minSalary)} - ${formatSalary(
          element.maxSalary
        )}`
      : element.minSalary
      ? formatSalary(element.minSalary)
      : element.maxSalary
      ? formatSalary(element.maxSalary)
      : '-';
  }
}
