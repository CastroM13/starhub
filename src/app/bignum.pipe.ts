import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bignum'
})
export class BignumPipe implements PipeTransform {

  transform(s: string): unknown {
    let n=s.length;
    return n > 4 && n <= 6 ? s.substring(0, n-3) + ("0" != s.substring(n-2,n-3) ? "," + s.substring(n-2,n-3) : "") + "k"
         : n > 6 && n <= 9 ? s.substring(0, n-6) + ("0" != s.substring(n-5,n-6) ? "," + s.substring(n-5,n-6) : "") + "M"
         : n > 9 ? s.substring(0, n-9) + ("0" != s.substring(n-8,n-9) ? "," + s.substring(n-8,n-9) : "") + "B"
         : s
  }

}
