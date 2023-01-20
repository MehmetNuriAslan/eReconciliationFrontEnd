import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyAccount } from '../models/currencyAccount';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CurrencyAccountService {

  constructor(
    @Inject('apiUrl') private apiUrl:string,
    private httpClient:HttpClient
  ) { }

getlist(companyId:number):Observable<ListResponseModel<CurrencyAccount>>{
let api=this.apiUrl+"CurencyAccount/getlist/"+companyId;
return this.httpClient.get<ListResponseModel<CurrencyAccount>>(api);
}



}
