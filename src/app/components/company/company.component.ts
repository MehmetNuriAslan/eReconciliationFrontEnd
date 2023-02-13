import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompanyModel } from 'src/app/models/companyModel';
import { CompanyDto } from 'src/app/models/dtos/companyDto';
import { UserOperationClaim } from 'src/app/models/UserOperationClaim';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  ngOnInit(): void {
    this.refresh()
    this.userOperationClaimGetList()
    this.getlist()
    this.createAddForm()
    this.createUpdateForm()
  }

  @Inject("validHatasi") private validHatasi: string

  jwtHelper: JwtHelperService = new JwtHelperService;
  isAuthenticated: boolean;
  userOperationClaims: UserOperationClaim[] = []
  companys: CompanyModel[] = []
  company: CompanyModel
  companyDto: CompanyDto

  searchString: string;
  pasifList: boolean = false
  aktifList: boolean = true
  allList: boolean = false
  addform: FormGroup
  updateForm: FormGroup

  allListCheck: string = ""
  aktiveListCheck: string = ""
  passiveListCheck: string = ""
  title: string = "Aktif Şirket Listesi"
  filterText: string = ""
  operationAdd = false
  operationUpdate = false
  operationDelete = false
  operationGet = false
  operationGetList = false

  address: string = ""
  taxDepartment: string = ""
  taxIdNumber: string = ""
  identityNumber: string = ""
  name: string = ""
  companyId: number;
  userId: number;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private userOperationClaimService: UserOperationClaimService,
    private companyService: CompanyService
  ) { }

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

  createAddForm() {
    this.addform = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      name: [" ", (Validators.required, Validators.minLength(3))],
      address: ["", (Validators.required, Validators.minLength(3))],
      taxDepartment: [""],
      taxIdNumber: [""],
      identityNumber: [""],
      addedAt: [this.datepipe.transform(Date(), 'yyyy-MM-dd')],
      isActive: true
    })
  }
  createUpdateForm() {
    this.updateForm = this.formBuilder.group({
      id: [0],
      userId: [this.userId, Validators.required],
      name: [" ", (Validators.required, Validators.minLength(3))],
      address: ["", (Validators.required, Validators.minLength(3))],
      taxDepartment: [""],
      taxIdNumber: [""],
      identityNumber: [""],
      addedAt: [this.datepipe.transform(Date(), 'yyyy-MM-dd')],
      isActive: true
    })
  }

  deleteCompany(company: CompanyModel) {
    this.spinner.show()
    this.companyService.delete(company).subscribe(res => {
      this.spinner.hide()
      this.toaster.success(res.message)
      this.getlist()
      console.log(this.getlist())
    }, err => {
      this.toaster.error(err.error)
      this.spinner.hide()
    }
    )

  }

  addCompany() {

    if (this.addform.valid) {
      let companyModel = Object.assign({}, this.addform.value)
      this.companyDto = {
        "company": {
          addedAt: this.datepipe.transform(Date(), 'yyyy-MM-dd'),
          address: companyModel.address,
          id: 0,
          identityNumber: companyModel.identityNumber,
          isActive: true,
          name: companyModel.name,
          taxDepartment: companyModel.taxDepartment,
          taxIdNumber: companyModel.taxIdNumber
        },
        userId: companyModel.userId
      }
      console.log(this.companyDto)
      this.spinner.show()
      this.companyService.add(this.companyDto).subscribe(res => {
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

  // selectCompany(company: CompanyModel) {
  //   this.company = company
  // }

  loadCompany(company: CompanyModel) {
    this.company = company
    this.updateForm.controls["id"].setValue(company.id)
    this.updateForm.controls["name"].setValue(company.name)
    this.updateForm.controls["address"].setValue(company.address)
    this.updateForm.controls["taxDepartment"].setValue(company.taxDepartment)
    this.updateForm.controls["taxIdNumber"].setValue(company.taxIdNumber)
    this.updateForm.controls["identityNumber"].setValue(company.identityNumber)

  }
  closeUpdateModal(){
    this.address = ""
    this.taxDepartment = ""
    this.taxIdNumber = ""
    this.identityNumber = ""
    this.name = ""
  }

  changeStatusCompany(company: CompanyModel) {
    this.spinner.show()
    company.isActive ? company.isActive = false : company.isActive = true
    this.companyService.update(company).subscribe(res => {
      this.spinner.hide()
      this.toaster.warning(res.message)
      this.getlist()
    }, err => {
      this.toaster.error(err.error)
      this.spinner.hide()
    }
    )
  }
  updateCompany() {
    if (this.updateForm.valid) {
      let companyModel = Object.assign({}, this.updateForm.value)
      console.log(companyModel)
      this.spinner.show()
      this.companyService.update(companyModel).subscribe(res => {
        this.spinner.hide()
        this.toaster.success(res.message)
        this.getlist()
        this.createUpdateForm()
        document.getElementById("closeaupdateModel").click()
      }, err => {
        this.toaster.error(err.error)
        this.spinner.hide()
      }
      )
    } else {
      this.toaster.error(this.validHatasi)
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
        if (e.operationName == "Company.Add") {
          this.operationAdd = true
        }
        if (e.operationName == "Company.Update") {
          this.operationUpdate = true
        }
        if (e.operationName == "Company.Delete") {
          this.operationDelete = true
        }
        if (e.operationName == "Company.Get") {
          this.operationGet = true
        }
        if (e.operationName == "Company.GetList") {
          this.operationGetList = true
        }
      })


      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toaster.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }
  changeInputClass2(text: string) {
    if (text != '') {
      return 'input-group input-group-dynamic is-valid my-3';
    } else {
      return 'input-group input-group-dynamic is-invalid my-3';
    }
  }
  changeInputClass(text: string) {
    if (text != '') {
      return 'input-group input-group-outline is-valid my-3';
    } else {
      return 'input-group input-group-outline is-invalid my-3';
    }
  }

  getlist() {
    this.spinner.show()
    this.companyService.getCompanyList().subscribe((res) => {
      this.companys = res.data;
      console.log(this.companys)
      this.spinner.hide()
    }, err => {
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
    let title = "Şirket Listesi"
    title = title.replace(" ", "")
    title = title + '.xlsx'
    XLSX.writeFile(wb, title)
  }

  getlistByCheck(text: string) {

    if (text == 'allList') {
      this.aktifList = false
      this.pasifList = false

      this.allListCheck = "checked"
      this.aktiveListCheck = ""
      this.passiveListCheck = ""
      this.filterText = ""
      this.title = "Tüm Şirket Liste"
    } else if (text == 'aktifList') {
      this.allList = false
      this.pasifList = false

      this.allListCheck = ""
      this.aktiveListCheck = "checked"
      this.passiveListCheck = ""
      this.filterText = "true"
      this.title = "Aktif Şirket Liste"
    } else if (text == 'pasifList') {
      this.aktifList = false
      this.allList = false

      this.allListCheck = ""
      this.aktiveListCheck = ""
      this.passiveListCheck = "checked"
      this.filterText = "false"
      this.title = "Pasif Şirket Liste"
    }
  }
}
