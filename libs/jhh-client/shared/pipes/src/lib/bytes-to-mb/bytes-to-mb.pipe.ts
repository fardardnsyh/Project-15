import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToMb',
  standalone: true,
})
export class BytesToMbPipe implements PipeTransform {
  transform(value: number): string {
    const megabytes: number = value / (1024 * 1024);
    return megabytes.toFixed(2) + ' MB';
  }
}
