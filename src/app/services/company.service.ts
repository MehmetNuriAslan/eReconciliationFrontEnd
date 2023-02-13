import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyModel } from '../models/companyModel';
import { CompanyDto } from '../models/dtos/companyDto';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    @Inject("apiUrl") private apiUrl:string,
    private httpClient:HttpClient
  ) { }

  getCompanyList(): Observable<ListResponseModel<CompanyModel>> {
    let api = this.apiUrl + "Company/getcompanylist"
    return this.httpClient.get<ListResponseModel<CompanyModel>>(api);
  }
  getbyid(id: number): Observable<SingleResponseModel<CompanyModel>> {
    let api = this.apiUrl + "Company/getcompany?id=" + id;
    return this.httpClient.get<SingleResponseModel<CompanyModel>>(api);
  }

  delete(company: CompanyModel): Observable<ResponseModel> {
    let api = this.apiUrl + "Company/deleteCompany";
    return this.httpClient.post<ResponseModel>(api, company);
  }

  update(company: CompanyModel): Observable<ResponseModel> {
    let api = this.apiUrl + "Company/updateCompany";
    return this.httpClient.post<ResponseModel>(api, company);
  }

  add(company: CompanyDto): Observable<ResponseModel> {
    let api = this.apiUrl + "Company/addcompany";
    return this.httpClient.post<ResponseModel>(api, company);
  }
}
