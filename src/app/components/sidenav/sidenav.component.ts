import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserOperationClaim } from 'src/app/models/UserOperationClaim';
import { AuthService } from 'src/app/services/auth.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  jwtHelper: JwtHelperService = new JwtHelperService;
  isAuthenticated: boolean;
  name: string;
  companyName: string;
  currentUrl: string;
  currencyAccount=false
  userOperationClaims: UserOperationClaim[] = []
  companyId: number;
  userId: number;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private userOperationClaimService: UserOperationClaimService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated()
    this.refresh()
    this.userOperationClaimGetList()
  }

  refresh() {
    if (this.isAuthenticated) {
      let token = localStorage.getItem("token")
      let decode = this.jwtHelper.decodeToken(token)
      let name = Object.keys(decode).filter(x => x.endsWith("/name"))[0];
      this.name = decode[name]
      let companyName = Object.keys(decode).filter(x => x.endsWith("/ispersistent"))[0];
      this.companyName = decode[companyName]
      let companyId = Object.keys(decode).filter(x => x.endsWith("/anonymous"))[0];
      this.companyId = decode[companyId]
      let userId = Object.keys(decode).filter(x => x.endsWith("/nameidentifier"))[0];
      this.userId = decode[userId]
    }
  }
  logout() {
    localStorage.removeItem("token")
    this.toastr.warning("Başarıyla çıkış yaptınız.")
    this.router.navigate(["/login"])
    this.isAuthenticated = false
  }
  changeClass(url:string){
    this.currentUrl=this.router.routerState.snapshot.url
    if(url==this.currentUrl){
      return "nav-link text-white active bg-gradient-primary";
    }
    else{
      return "nav-link text-white";
    }
  }

  userOperationClaimGetList() {
    this.spinner.show()
    this.userOperationClaimService.getlist(this.userId, this.companyId).subscribe((res) => {
      this.userOperationClaims = res.data;
console.log(res.data)
      res.data.forEach(e => {
        if (e.operationName == "Admin") {
          this.currencyAccount = true
        }
        if (e.operationName == "CurrencyAccount") {
          this.currencyAccount = true
        }
      })


      this.spinner.hide()
    }, err => {
      console.log(err)
      this.spinner.hide()
      this.toastr.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }
}
