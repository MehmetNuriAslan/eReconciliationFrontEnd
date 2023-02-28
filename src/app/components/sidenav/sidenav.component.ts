import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MailParameter } from 'src/app/models/mailParameterModel';
import { MailTemplate } from 'src/app/models/mailTemplateModel';
import { UserOperationClaim } from 'src/app/models/UserOperationClaim';
import { AuthService } from 'src/app/services/auth.service';
import { MailParameterService } from 'src/app/services/mail-parameter.service';
import { MailTemplateService } from 'src/app/services/mail-template.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Inject("validHatasi") private validHatasi: string

  jwtHelper: JwtHelperService = new JwtHelperService;
  isAuthenticated: boolean;
  name: string;
  companyName: string;
  currentUrl: string;
  userOperationClaims: UserOperationClaim[] = []
  companyId: number;
  userId: number;
  htmlContent: string

  currencyAccount = false
  user = false
  company = false
  mailParameter = false
  mailTemplate = false
  accountReconciliation = false
  baBsReconciliation = false
  email: string

  mailParametre: MailParameter = {
    companyId: 0,
    email: "",
    id: 0,
    password: "",
    port: 0,
    smtp: "",
    ssl: false
  }
  mailTemplateModel: MailTemplate = {
    companyId: 0,
    id: 0,
    type: "",
    value: "",
  }

  updateForm: FormGroup;
  updateMailTemplateForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private userOperationClaimService: UserOperationClaimService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private mailparameterservice: MailParameterService,
    private mailtemplateService: MailTemplateService
  ) { }
  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated()
    this.refresh()
    this.userOperationClaimGetList()
    this.createUpdateForm()
  }

  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0, Validators.required],
      email: ["", Validators.required],
      password: [""],
      companyId: [this.companyId, Validators.required],
      smtp: ["", Validators.required],
      port: [0, Validators.required],
      ssl: [false, Validators.required],
    })
  }
  createMailTemplateUpdateForm() {
    this.updateMailTemplateForm = this.formBuilder.group({
      id: [0, Validators.required],
      companyId: [this.companyId, Validators.required],
      type: ["Reconciliation", Validators.required],
      value: [0, Validators.required],
    })
  }
  changeEditorText() {

  }

  getEditorText() {
    console.log(this.htmlContent)
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
  changeClass(url: string) {
    this.currentUrl = this.router.routerState.snapshot.url
    if (url == this.currentUrl) {
      return "nav-link text-white active bg-gradient-primary";
    }
    else {
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
          this.user = true
          this.company = true
          this.mailParameter = true
          this.mailTemplate = true
          this.accountReconciliation = true
          this.baBsReconciliation = true
        }
        if (e.operationName == "CurrencyAccount") {
          this.currencyAccount = true
        }
        if (e.operationName == "user") {
          this.user = true
        }
        if (e.operationName == "company") {
          this.company = true
        }
        if (e.operationName == "mailParameter") {
          this.mailParameter = true
        }
        if (e.operationName == "mailTemplate") {
          this.mailTemplate = true
        }
        if (e.operationName == "accountReconciliation") {
          this.accountReconciliation = true
        }
        if (e.operationName == "baBsReconciliation") {
          this.baBsReconciliation = true
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
  changeInputClass(text: string) {
    if (text != '') {
      return 'input-group input-group-dynamic is-valid my-3';
    } else {
      return 'input-group input-group-dynamic is-invalid my-3';
    }
  }
  getMailParameter() {
    this.spinner.show()
    this.mailparameterservice.getById(this.companyId).subscribe((res) => {
      this.mailParametre = res.data
      console.log(this.mailParametre)
      this.updateForm.controls["email"].setValue(res.data.email);
      this.updateForm.controls["password"].setValue(res.data.password);
      this.updateForm.controls["smtp"].setValue(res.data.smtp);
      this.updateForm.controls["port"].setValue(res.data.port);
      this.updateForm.controls["id"].setValue(res.data.id);
      this.updateForm.controls["ssl"].setValue(res.data.ssl);
      console.log(this.updateForm.controls["smtp"].value)
      this.spinner.hide()
    }, err => {
      console.log(err)
      this.spinner.hide()
      this.toastr.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }

  getMailTemplate() {
    this.spinner.show()
    this.mailtemplateService.getCompanyId(this.companyId).subscribe((res) => {
      if (res.data !=null) {
        this.htmlContent = res.data.value
      }
      this.spinner.hide()
    }, err => {
      console.log(err)
      this.spinner.hide()
      this.toastr.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }
  connectionTest(email: string) {
    console.log(email)
    this.spinner.show()
    this.mailparameterservice.connectionTest(email).subscribe((res) => {
      this.toastr.success(res.message)
      this.spinner.hide()
    }, err => {
      console.log(err)
      this.spinner.hide()
      this.toastr.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }
  update() {
    if (this.updateForm.valid) {
      let mailparameterModel = Object.assign({}, this.updateForm.value)
      this.spinner.show()
      this.mailparameterservice.update(mailparameterModel).subscribe(res => {
        this.spinner.hide()
        this.toastr.warning(res.message)
        //document.getElementById("closeupdateModel").click()
      }, err => {
        this.toastr.error(err.error)
        this.spinner.hide()
      }
      )
    } else {
      this.toastr.error(this.validHatasi)
    }
  }
}
