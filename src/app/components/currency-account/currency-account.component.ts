import { Component, OnInit } from '@angular/core';
import { CurrencyAccount } from 'src/app/models/currencyAccount';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-currency-account',
  templateUrl: './currency-account.component.html',
  styleUrls: ['./currency-account.component.scss']
})
export class CurrencyAccountComponent implements OnInit{
  jwtHelper: JwtHelperService = new JwtHelperService;
  isAuthenticated: boolean;
  currencyAccount:CurrencyAccount[]=[]
  name: string;
  companyId: number;

  constructor(
    private currencyAccountservice:CurrencyAccountService,
    private authService:AuthService,
  ){}

  ngOnInit(): void {
this.isAuthenticated=this.authService.isAuthenticated()
    this.refresh()
  }

  refresh() {
    if (this.isAuthenticated) {
      let token = localStorage.getItem("token")
      let decode = this.jwtHelper.decodeToken(token)
      let companyId = Object.keys(decode).filter(x => x.endsWith("/anonymous"))[0];
      this.companyId = decode[companyId]
      let companyName = Object.keys(decode).filter(x => x.endsWith("/ispersistent"))[0];
      console.log(decode)
    }
  }
}
