import { Pipe, PipeTransform } from '@angular/core';
import { UserDto } from '../models/userDto';

@Pipe({
  name: 'userFilterPipe'
})
export class UserFilterPipe implements PipeTransform {

  transform(value: UserDto[], filtertext:string): UserDto[] {
    return filtertext?value.filter((p:UserDto)=>p.userIsActive.toString().toLowerCase().indexOf(filtertext)!==-1):value;
  }

}
