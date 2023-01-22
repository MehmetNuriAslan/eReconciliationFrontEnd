import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyAccount } from '../models/currencyAccount';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CurrencyAccountService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  getlist(companyId: number): Observable<ListResponseModel<CurrencyAccount>> {
    let api = this.apiUrl + "CurencyAccount/getlist?companyId=" + companyId;
    return this.httpClient.get<ListResponseModel<CurrencyAccount>>(api);
  }
  getbyid(id: number): Observable<SingleResponseModel<CurrencyAccount>> {
    let api = this.apiUrl + "CurencyAccount/getById?id=" + id;
    return this.httpClient.get<SingleResponseModel<CurrencyAccount>>(api);
  }

  delete(currencyAccount: CurrencyAccount): Observable<ResponseModel> {
    let api = this.apiUrl + "CurencyAccount/delete";
    return this.httpClient.post<ResponseModel>(api, currencyAccount);
  }

  update(currencyAccount: CurrencyAccount): Observable<ResponseModel> {
    let api = this.apiUrl + "CurencyAccount/update";
    return this.httpClient.post<ResponseModel>(api, currencyAccount);
  }

  add(currencyAccount: CurrencyAccount): Observable<ResponseModel> {
    let api = this.apiUrl + "CurencyAccount/add";
    return this.httpClient.post<ResponseModel>(api, currencyAccount);
  }

  addFromExel(file: any, companyId: number): Observable<ResponseModel> {
    let api = this.apiUrl + "CurencyAccount/addFromExel?companyId=" + companyId;
    const formdata = new FormData
    formdata.append("file", file, file.name)

    return this.httpClient.post<ResponseModel>(api, formdata);
  }



}
