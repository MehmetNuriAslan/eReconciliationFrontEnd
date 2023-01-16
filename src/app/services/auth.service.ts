import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
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
  constructor(
    private httpclient: HttpClient,
    @Inject('apiUrl') private apiUrl:string
    ) { }

  register(registerDto: RegisterDto) {
    let api = this.apiUrl+ 'auth/register';
    return this.httpclient.post<SingleResponseModel<TokenModel>>(
      api,
      registerDto
    );
  }

  login(LoginModel: LoginModel) {
    let api = this.apiUrl+ 'auth/login';
    return this.httpclient.post<SingleResponseModel<TokenModel>>(
      api,
      LoginModel
    );
  }

  getTermsAndCondition(){
    let api = this.apiUrl+ 'TermsAndConditions/get';
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
    let api = this.apiUrl+ 'auth/sendconfirmemail?email='+email;
    return this.httpclient.get<ResponseModel>(api);
  }

  sendConfirmUser(value:string){
    let api = this.apiUrl+ 'Auth/confirmuser?value='+value;
    return this.httpclient.get<ResponseModel>(api);
  }

  sendForgotPassword(email:string){
    let api = this.apiUrl+ 'Auth/forgotPassword?email='+email;
    return this.httpclient.get<ResponseModel>(api);
  }

  confirmForgotPasswordValue(value:string){
    let api = this.apiUrl+ 'Auth/forgotPasswordLinkCheck?value='+value;
    return this.httpclient.get(api);
  }

  changePasswordToForgotPassword(forgotPasswordDto:ForgotPasswordDto){
    let api = this.apiUrl+ 'Auth/changePasswordToForgotPassword';
    return this.httpclient.post<ResponseModel>(api,forgotPasswordDto);
  }
}
