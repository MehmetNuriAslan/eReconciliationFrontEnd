import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { UserDto } from '../models/userDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    @Inject("apiUrl") private apiUrl:string,
    private httpClient:HttpClient
  ) { }

  getUserList(companyId: number): Observable<ListResponseModel<UserDto>> {
    let api = this.apiUrl + "User/getUserlist?companyId="+companyId
    return this.httpClient.get<ListResponseModel<UserDto>>(api);
  }

}
