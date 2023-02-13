import { Pipe, PipeTransform } from '@angular/core';
import { CompanyModel } from '../models/companyModel';

@Pipe({
  name: 'companyFilterPipe'
})
export class CompanyFilterPipe implements PipeTransform {

  transform(value: CompanyModel[], filtertext:string): CompanyModel[] {
    return filtertext?value.filter((p:CompanyModel)=>p.isActive.toString().toLowerCase().indexOf(filtertext)!==-1):value;
  }

}
