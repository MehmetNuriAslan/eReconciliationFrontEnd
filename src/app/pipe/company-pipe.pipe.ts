import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companyPipe'
})
export class CompanyPipePipe implements PipeTransform {

  transform(value: any[], searchString:string) {
    if (!searchString) {
      return value;
    }

    return value.filter(i=>{
      const name =i.name.toLowerCase().toString().includes(searchString.toLowerCase())
      const address =i.address.toLowerCase().toString().includes(searchString.toLowerCase())
      const taxDepartment =i.taxDepartment.toLowerCase().toString().includes(searchString.toLowerCase())
      const addedAt =i.addedAt.toString().includes(searchString.toLowerCase())
      const isActive =i.isActive.toString().includes(searchString.toLowerCase())
      // const taxIdNumber =i.taxIdNumber!=null?i.taxIdNumber.toLowerCase().toString().includes(searchString):""
      //const addedAt =i.addedAt!=null?i.identityNumber.toLowerCase().toString().includes(searchString):""

      return (name+address+taxDepartment+addedAt+isActive)//)
    })
  }

}
