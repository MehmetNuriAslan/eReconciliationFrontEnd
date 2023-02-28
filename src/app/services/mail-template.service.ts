import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailTemplate } from '../models/mailTemplateModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class MailTemplateService {

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private httpClient: HttpClient
  ) { }

  getCompanyId(companyId:number):Observable<SingleResponseModel<MailTemplate>>{
    let api = this.apiUrl +"MailTemplates/getByCompanyId?companyId="+companyId;
    return this.httpClient.get<SingleResponseModel<MailTemplate>>(api);
      }
}
