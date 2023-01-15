import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ForgotPasswordDto } from '../models/dtos/forgotPasswordDto';
import { RegisterDto } from '../models/dtos/registerDto';
import { LoginModel } from '../models/loginModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { TermsAndConditions } from './termsAndCondition';

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

  getTermsAndCondition(){
    let api = 'https://localhost:7297/api/TermsAndConditions/get';
    return this.httpclient.get<SingleResponseModel<TermsAndConditions>>(api);
  }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  sendConfirmEmail(email:string){
    let api = 'https://localhost:7297/api/auth/sendconfirmemail?email='+email;
    return this.httpclient.get<ResponseModel>(api);
  }

  sendConfirmUser(value:string){
    let api = 'https://localhost:7297/api/Auth/confirmuser?value='+value;
    return this.httpclient.get<ResponseModel>(api);
  }

  sendForgotPassword(email:string){
    let api = 'https://localhost:7297/api/Auth/forgotPassword?email='+email;
    return this.httpclient.get<ResponseModel>(api);
  }

  confirmForgotPasswordValue(value:string){
    let api = 'https://localhost:7297/api/Auth/forgotPasswordLinkCheck?value='+value;
    return this.httpclient.get(api);
  }

  changePasswordToForgotPassword(forgotPasswordDto:ForgotPasswordDto){
    let api = 'https://localhost:7297/api/Auth/changePasswordToForgotPassword';
    return this.httpclient.post<ResponseModel>(api,forgotPasswordDto);
  }
}
