import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upperFirst',
  standalone: true
})
export class UpperFirstPipe implements PipeTransform {

  transform(value: string | undefined): string | undefined {
    if (!value)
      return;

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
