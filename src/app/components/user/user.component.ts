import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/models/userDto';
import { UserForRegisterToSecondAccountDto } from 'src/app/models/userForRegisterToSecondAccountDto';
import { UserOperationClaim } from 'src/app/models/UserOperationClaim';
import { AuthService } from 'src/app/services/auth.service';
import { UserOperationClaimService } from 'src/app/services/user-operation-claim.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Inject("validHatasi") private validHatasi: string

  title: string = "Aktif Kullanıcı Listeleri"
  jwtHelper: JwtHelperService = new JwtHelperService;
  companyId: number;
  userId: number;
  userOperationClaims: UserOperationClaim[] = []
  users: UserDto[] = []
  searchString: string;
  filterText: string = ""
  userForRegisterToSecondAccountDto: UserForRegisterToSecondAccountDto
  userUpdateForm: FormGroup
  userAddForm: FormGroup

  pasifList: boolean = false
  aktifList: boolean = true
  allList: boolean = false

  allListCheck: string = ""
  aktiveListCheck: string = ""
  passiveListCheck: string = ""

  name:string= ""
  email:string= ""
  password:string= ""

  operationAdd = false
  operationUpdate = false
  operationDelete = false
  operationGet = false
  operationGetList = false
  isAuthenticated = false

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe,
    private userOperationClaimService: UserOperationClaimService,
    private userservice: UserService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.refresh()
    this.userOperationClaimGetList()
    this.getlist()
    this.createAddForm()
  }

  refresh() {
    this.isAuthenticated = this.authService.isAuthenticated()
    if (this.isAuthenticated) {
      let token = localStorage.getItem("token")
      let decode = this.jwtHelper.decodeToken(token)
      let companyId = Object.keys(decode).filter(x => x.endsWith("/anonymous"))[0];
      this.companyId = decode[companyId]
      console.log(this.companyId)
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
        if (e.operationName == "User.Add") {
          this.operationAdd = true
        }
        if (e.operationName == "User.Update") {
          this.operationUpdate = true
        }
        if (e.operationName == "User.Delete") {
          this.operationDelete = true
        }
        if (e.operationName == "User.GetList") {
          this.operationGetList = true
        }
      })


      this.spinner.hide()
    }, err => {
      console.log(err + "operationclaim")
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

  getlistByCheck(text: string) {

    if (text == 'allList') {
      this.aktifList = false
      this.pasifList = false

      this.allListCheck = "checked"
      this.aktiveListCheck = ""
      this.passiveListCheck = ""
      this.filterText = ""
      this.title = "Tüm Kullanıcı Liste"
    } else if (text == 'aktifList') {
      this.allList = false
      this.pasifList = false

      this.allListCheck = ""
      this.aktiveListCheck = "checked"
      this.passiveListCheck = ""
      this.filterText = "true"
      this.title = "Aktif Kullanıcı Liste"
    } else if (text == 'pasifList') {
      this.aktifList = false
      this.allList = false

      this.allListCheck = ""
      this.aktiveListCheck = ""
      this.passiveListCheck = "checked"
      this.filterText = "false"
      this.title = "Pasif Kullanıcı Liste"
    }
  }

  add() {

    if (this.userAddForm.valid) {
      this.spinner.show()
      let userModel = Object.assign({}, this.userAddForm.value)
      console.log(userModel)
      this.userservice.userRegister(userModel).subscribe(res => {
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
  update() { }


  getlist() {
    this.spinner.show()
    this.userservice.getUserList(this.companyId).subscribe((res) => {
      this.users = res.data;
      console.log(res.data)
      this.spinner.hide()
    }, err => {
      console.log("userlist" + err)
      this.spinner.hide()
      this.toaster.error("Bir Hatayla Karşılaşşıldı")
    }
    )
  }
  createAddForm() {
    this.userAddForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      companyId: [this.companyId, Validators.required],
    })
  }

  changeInputClass(text: string) {
    if (text != '') {
      return 'input-group input-group-outline is-valid my-3';
    } else {
      return 'input-group input-group-outline is-invalid my-3';
    }
  }
}
