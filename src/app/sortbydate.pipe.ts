import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortbydate'
})

export class SortbydatePipe implements PipeTransform {

  transform(value: Array<any>): unknown {
    const newValue = value.sort((a, b) => {
      const adate = a.date.split('/')[1] + '/' + a.date.split('/')[0] + '/' + a.date.split('/')[2];
      const bdate = b.date.split('/')[1] + '/' + b.date.split('/')[0] + '/' + b.date.split('/')[2];
      return <any>new Date(bdate) - <any>new Date(adate);
    });
    return newValue;
  }

}
