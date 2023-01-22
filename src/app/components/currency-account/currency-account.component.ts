import { Component, Inject, inject, OnInit } from '@angular/core';
import { CurrencyAccount } from 'src/app/models/currencyAccount';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyAccountService } from 'src/app/services/currency-account.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserOperationClaim } from 'src/app/models/UserOperationClaim';
@Component({
  selector: 'app-currency-account',
  templateUrl: './currency-account.component.html',
  styleUrls: ['./currency-account.component.scss']
})
export class CurrencyAccountComponent implements OnInit {

  @Inject("validHatasi") private validHatasi: string

  jwtHelper: JwtHelperService = new JwtHelperService;
  isAuthenticated: boolean;
  currencyAccounts: CurrencyAccount[] = []
  userOperationClaims: UserOperationClaim[] = []
  currencyAccount: CurrencyAccount
  companyId: number;
  userId: number;
  searchString: string;
  pasifList: boolean = false
  aktifList: boolean = true
  allList: boolean = false

  allListCheck: string = ""
  aktiveListCheck: string = ""
  passiveListCheck: string = ""
  title: string = "Aktif Cari Liste"
  filterText: string = ""
  addform: FormGroup
  updateForm: FormGroup

  code: string
  name: string = ""
  address: string = ""
  taxDepartment: string
  taxIdNumber: string
  identityNumber: string
  email: string
  authorized: string
  file: string

  operationAdd = false
  operationUpdate = false
  operationDelete = false
  operationGet = false
  operationGetList = false

  constructor(
    private currencyAccountservice: CurrencyAccountService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private userOperationClaimService: UserOperationClaimService
  ) { }

  ngOnInit(): void {
    this.refresh()
    this.userOperationClaimGetList()
    this.getlist()
    this.createAddForm()
    this.createUpdateForm()
  }

  refresh() {
    this.isAuthenticated = this.authService.isAuthenticated()
    if (this.isAuthenticated) {
      let token = localStorage.getItem("token")
      let decode = this.jwtHelper.decodeToken(token)
      let companyId = Object.keys(decode).filter(x => x.endsWith("/anonymous"))[0];
      this.companyId = decode[companyId]
      let userId = Object.keys(decode).filter(x => x.endsWith("/nameidentifier"))[0];
      this.userId = decode[userId]
    }
  }

  userOperationClaimGetList() {
    this.spinner.show()
    this.userOperationClaimService.getlist(this.userId, this.companyId).subscribe((res) => {
      this.userOperationClaims = res.data;

      res.data.forEach(e => {
        if (e.operationName == "Admin") {
          this.operationAdd = true
          this.operationUpdate = true
          this.operationDelete = true
          this.operationGet = true
          this.operationGetList = true
        }
        if (e.operationName == "CurrencyAccount.Add") {
          this.operationAdd = true
        }
        if (e.operationName == "CurrencyAccount.Update") {
          this.operationUpdate = true
        }
        if (e.operationName == "CurrencyAccount.Delete") {
          this.operationDelete = true
        }
        if (e.operationName == "CurrencyAccount.Get") {
          this.operationGet = true
        }
        if (e.operationName == "CurrencyAccount.GetList") {
          this.operationGetList = true
        }
      })


      this.spinner.hide()
    }, err => {
      console.log(err)
      this.spinner.hide()
      this.toaster.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }

  getlist() {
    this.spinner.show()
    this.currencyAccountservice.getlist(this.companyId).subscribe((res) => {
      this.currencyAccounts = res.data;
      this.spinner.hide()
    }, err => {
      console.log(err)
      this.spinner.hide()
      this.toaster.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }
  exportExel() {
    let table = document.getElementById("exelTable")
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    let title = this.title
    title = title.replace(" ", "")
    title = title + '.xlsx'
    XLSX.writeFile(wb, title)
  }

  deleteCurrencyAccount(currencyAccount: CurrencyAccount) {
    this.spinner.show()
    this.currencyAccountservice.delete(currencyAccount).subscribe(res => {
      this.spinner.hide()
      this.toaster.success(res.message)
      this.getlist()
    }, err => {
      this.toaster.error(err.error)
      this.spinner.hide()
    }
    )

  }

  selectCurrencyAccount(currencyAccount: CurrencyAccount) {
    this.currencyAccount = currencyAccount
  }

  changeStatusCurrencyAccount(currencyAccount: CurrencyAccount) {
    this.spinner.show()
    currencyAccount.isActive ? currencyAccount.isActive = false : currencyAccount.isActive = true
    this.currencyAccountservice.update(currencyAccount).subscribe(res => {
      this.spinner.hide()
      this.toaster.warning(res.message)
      this.getlist()
    }, err => {
      this.toaster.error(err.error)
      this.spinner.hide()
    }
    )
  }

  createAddForm() {
    this.addform = this.formBuilder.group({
      companyId: [this.companyId, Validators.required],
      code: [""],
      name: ["", (Validators.required, Validators.minLength(3))],
      address: ["", (Validators.required, Validators.minLength(3))],
      taxDepartment: [""],
      taxIdNumber: [""],
      identityNumber: [""],
      email: [""],
      authorized: [""],
      addedAt: [this.datepipe.transform(Date(), 'yyyy-MM-dd')],
      isActive: true
    })
  }

  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0],
      companyId: [this.companyId, Validators.required],
      code: [""],
      name: ["", (Validators.required, Validators.minLength(3))],
      address: ["", (Validators.required, Validators.minLength(3))],
      taxDepartment: [""],
      taxIdNumber: [""],
      identityNumber: [""],
      email: [""],
      authorized: [""],
      addedAt: [this.datepipe.transform(Date(), 'yyyy-MM-dd')],
      isActive: true
    })
  }

  addCurrencyAccount() {

    if (this.addform.valid) {
      let currencyAccountModel = Object.assign({}, this.addform.value)
      this.spinner.show()
      this.currencyAccountservice.add(currencyAccountModel).subscribe(res => {
        this.spinner.hide()
        this.toaster.success(res.message)
        this.getlist()
        this.createAddForm()
        document.getElementById("closeaddModel").click()
      }, err => {
        this.toaster.error(err.error)
        this.spinner.hide()
      }
      )
    } else {
      this.toaster.error(this.validHatasi)
    }

  }

  updateCurrencyAccount() {

    if (this.addform.valid) {
      let currencyAccountModel = Object.assign({}, this.updateForm.value)
      this.spinner.show()
      this.currencyAccountservice.update(currencyAccountModel).subscribe(res => {
        this.spinner.hide()
        this.toaster.warning(res.message)
        this.getlist()
        this.createAddForm()
        document.getElementById("closeupdateModel").click()
      }, err => {
        this.toaster.error(err.error)
        this.spinner.hide()
      }
      )
    } else {
      this.toaster.error(this.validHatasi)
    }

  }
  getlistByCheck(text: string) {
    console.log(this.allList)
    console.log(this.aktifList)
    console.log(this.pasifList)

    if (text == 'allList') {
      this.aktifList = false
      this.pasifList = false

      this.allListCheck = "checked"
      this.aktiveListCheck = ""
      this.passiveListCheck = ""
      this.filterText = ""
      this.title = "Tüm Cari Liste"
    } else if (text == 'aktifList') {
      this.allList = false
      this.pasifList = false

      this.allListCheck = ""
      this.aktiveListCheck = "checked"
      this.passiveListCheck = ""
      this.filterText = "true"
      this.title = "Aktif Cari Liste"
    } else if (text == 'pasifList') {
      this.aktifList = false
      this.allList = false

      this.allListCheck = ""
      this.aktiveListCheck = ""
      this.passiveListCheck = "checked"
      this.filterText = "false"
      this.title = "Pasif Cari Liste"
    }
  }

  changeInputClass(text: string) {
    if (text != '') {
      return 'input-group input-group-outline is-valid my-3';
    } else {
      return 'input-group input-group-outline is-invalid my-3';
    }
  }

  getCurrencyAccount(id: number) {
    this.spinner.show()
    console.log(id)
    this.currencyAccountservice.getbyid(id).subscribe(res => {
      this.spinner.hide()
      this.currencyAccount = res.data
      this.updateForm.controls["id"].setValue(res.data.id)
      this.updateForm.controls["companyId"].setValue(res.data.companyId)
      this.updateForm.controls["code"].setValue(res.data.code)
      this.updateForm.controls["name"].setValue(res.data.name)
      this.updateForm.controls["address"].setValue(res.data.address)
      this.updateForm.controls["taxDepartment"].setValue(res.data.taxDepartment)
      this.updateForm.controls["taxIdNumber"].setValue(res.data.taxIdNumber)
      this.updateForm.controls["identityNumber"].setValue(res.data.identityNumber)
      this.updateForm.controls["email"].setValue(res.data.email)
      this.updateForm.controls["authorized"].setValue(res.data.authorized)
    }, err => {
      this.toaster.error(err.error)
      this.spinner.hide()
    }
    )
  }
  onChange(event: any) {
    this.file = event.target.files[0]
  }

  addFromExelAccount() {

    if (this.file != null || this.file != "") {
      this.spinner.show()
      this.currencyAccountservice.addFromExel(this.file, this.companyId).subscribe(res => {
        this.spinner.hide()
        this.toaster.success(res.message)
        this.getlist()
        document.getElementById("closeexelModel").click()
        this.file = ""
      }, err => {
        this.toaster.error(err.error)
        this.spinner.hide()
      }
      )
    } else {
      this.toaster.error(this.validHatasi)
    }

  }

}
