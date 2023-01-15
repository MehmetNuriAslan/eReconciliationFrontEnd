import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterDto } from 'src/app/models/dtos/registerDto';
import { AuthService } from 'src/app/services/auth.service';
import { TermsAndConditions } from 'src/app/services/termsAndCondition';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerform: FormGroup
  isRegisterActivated: boolean = true
  isRegisterComplete: boolean = false
  registerdto: RegisterDto
  termsAndCondition: TermsAndConditions={description:"",id:0}

  termsAndConditionsCheck: boolean = false

  email: string = "";
  password: string = "";
  name: string = "";
  address: string = "";
  taxDepartment: string = "";
  taxIdNumber: string = "";
  identityNumber: string = "";
  companyName: string = "";


  constructor(private authservice: AuthService, private formbuilder: FormBuilder, private toasterService: ToastrService, private datepipe: DatePipe, private router: Router) { }


  ngOnInit(): void {
    this.getTermsAndCondition();
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerform = this.formbuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      companyName: ["", Validators.required],
      address: ["", Validators.required],
      taxDepartment: [""],
      taxIdNumber: [""],
      identityNumber: [""],
      addedAt: [Date.now],
      isActive: [true],
    })
  }

  register() {
    if (this.termsAndConditionsCheck) {
      if (this.registerform.valid) {
        this.isRegisterActivated = false;
        let registerModel = Object.assign({}, this.registerform.value);
        this.registerdto = {
          "userForRegister": {
            email: registerModel.email,
            password: registerModel.password,
            name: registerModel.name,
          },
          "company": {
            addedAt: this.datepipe.transform(Date(), 'yyyy-MM-dd'),
            address: registerModel.address,
            id: 0,
            identityNumber: registerModel.identityNumber,
            isActive: true,
            name: registerModel.companyName,
            taxDepartment: registerModel.taxDepartment,
            taxIdNumber: registerModel.taxIdNumber
          }

        }
        console.log(this.registerdto)
        this.authservice.register(this.registerdto).subscribe((res) => {
          this.isRegisterComplete=true
        }
        );
      } else {
        this.toasterService.error('Eksik Bilgileri doldurunuz', 'Hata');
      }
    } else {
this.toasterService.warning("Kullanıcı sözleşmesini onaylamadan Kayıt Yapamassınız")
    }

  }

  changeInputClass(text: string) {
    if (text != '') {
      return 'input-group input-group-outline is-valid my-3';
    } else {
      return 'input-group input-group-outline is-invalid my-3';
    }
  }

  getTermsAndCondition() {
    this.authservice.getTermsAndCondition().subscribe((res) => {
      this.termsAndCondition = res.data
    }, (err) => {
      this.toasterService.error(err.error);
    })
  }

}
