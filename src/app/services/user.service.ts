import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { UserDto } from '../models/userDto'; 
import { UserForRegisterToSecondAccountDto } from '../models/userForRegisterToSecondAccountDto';

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

  userRegister(userRegisterDto: UserForRegisterToSecondAccountDto) {
    let api = this.apiUrl+ 'auth/registerSecondAccount';
    return this.httpClient.post<SingleResponseModel<TokenModel>>(
      api,
      userRegisterDto
    );
  }

}
