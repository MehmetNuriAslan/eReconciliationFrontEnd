import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyAccount } from '../models/currencyAccount';

@Pipe({
  name: 'currencyAccountFilter'
})
export class CurrencyAccountFilterPipe implements PipeTransform {

  transform(value: CurrencyAccount[], filtertext:string): CurrencyAccount[] {
    return filtertext?value.filter((p:CurrencyAccount)=>p.isActive.toString().toLowerCase().indexOf(filtertext)!==-1):value;
  }

}
