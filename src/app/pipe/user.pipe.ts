import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userPipe'
})
export class UserPipe implements PipeTransform {

  transform(value: any[], searchString:string) {
    if (!searchString) {
      return value;
    }

    return value.filter(i=>{
      const email =i.email.toLowerCase().toString().includes(searchString.toLowerCase())
      const name =i.name.toLowerCase().toString().includes(searchString.toLowerCase())
      return (email+name)
    })
  }
}
