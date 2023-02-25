import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginModel } from 'src/app/models/loginModel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginform: FormGroup;
  isLoginActivated: boolean = true;
  email: string;
  password: string;
  confirmEmail:string="";

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService
  ) {}
  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginform = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginform.valid) {
      this.isLoginActivated = false;
      let loginModel = Object.assign({}, this.loginform.value);
      this.authService.login(loginModel).subscribe(
        (res) => {
          if (this.authService.redirectUrl) {
            this.router.navigate([this.authService.redirectUrl]);
          } else {
            this.router.navigate(['']);
          }
          localStorage.setItem('token', res.data.token);
          this.toasterService.success(res.message);
        },
        (err) => {
          this.isLoginActivated = true;
          this.toasterService.error("Giriş Yapılamadı");
        }
      );
    } else {
      this.toasterService.error('Eksik Bilgileri doldurunuz', 'Hata');
    }
  }

  changeInputClass(text: string) {
    if (text != '') {
      return 'input-group input-group-outline is-valid my-3';
    } else {
      return 'input-group input-group-outline is-invalid my-3';
    }
  }

  sendConfirmMail(){
    if(this.confirmEmail!=""){
      this.authService.sendConfirmEmail(this.confirmEmail).subscribe((res)=>{
        console.log(res)
        this.toasterService.success(res.message)
      },(err)=>{
        console.log(err)
        this.toasterService.error(err)
      }
      )
    }
  }

  sendForgotPasswordMail(){
    console.log(this.confirmEmail)
    if(this.confirmEmail!=""){
      console.log(this.confirmEmail)
      this.authService.sendForgotPassword(this.confirmEmail).subscribe((res)=>{
        console.log(res)
        this.toasterService.success(res.message)
      },(err)=>{
        console.log(err)
        this.toasterService.error(err)
      }
      )
    }
  }
}
