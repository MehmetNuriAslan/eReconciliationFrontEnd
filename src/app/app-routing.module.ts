import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './components/company/company.component';
import { CurrencyAccountComponent } from './components/currency-account/currency-account.component';
import { HomeComponent } from './components/home/home.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmComponent } from './components/register/confirm/confirm.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {path:'',component:HomeComponent,canActivate:[LoginGuard]},
  {path:'currency-account',component:CurrencyAccountComponent,canActivate:[LoginGuard]},
  {path:'user',component:UserComponent,canActivate:[LoginGuard]},
  {path:'company',component:CompanyComponent,canActivate:[LoginGuard]},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'confirm',component:LoginComponent},
  {path:'confirm/:value',component:ConfirmComponent},
  {path:'forgot-password',component:LoginComponent},
  {path:'forgot-password/:value',component:ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
