import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterDto } from '../models/dtos/registerDto';
import { LoginModel } from '../models/loginModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public redirectUrl: string;
  constructor(private httpclient: HttpClient) { }

  register(registerDto: RegisterDto) {
    let api = 'https://localhost:7297/api/auth/register';
    return this.httpclient.post<SingleResponseModel<TokenModel>>(
      api,
      registerDto
    );
  }

  login(LoginModel: LoginModel) {
    let api = 'https://localhost:7297/api/auth/login';
    return this.httpclient.post<SingleResponseModel<TokenModel>>(
      api,
      LoginModel
    );
  }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
