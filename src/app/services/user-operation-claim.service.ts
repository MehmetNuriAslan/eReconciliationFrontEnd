import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { UserOperationClaim } from '../models/UserOperationClaim';

@Injectable({
  providedIn: 'root'
})
export class UserOperationClaimService {

  constructor(
@Inject("apiUrl") private apiUrl:string,
private httpClient:HttpClient
  ) { }

  getlist(userId:number,companyId: number): Observable<ListResponseModel<UserOperationClaim>> {
    let api = this.apiUrl + "UserOperationClaims/getListDto?userId="+userId+"&companyId="+companyId;
    return this.httpClient.get<ListResponseModel<UserOperationClaim>>(api);
  }
}
