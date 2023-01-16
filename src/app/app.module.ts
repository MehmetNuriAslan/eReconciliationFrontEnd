import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { APP_BASE_HREF, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ConfirmComponent } from './components/register/confirm/confirm.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { NavComponent } from './components/nav/nav.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CurrencyAccountComponent } from './components/currency-account/currency-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    ForgotPasswordComponent,
    NavComponent,
    SidenavComponent,
    CurrencyAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      progressBar:true,
      closeButton:true
    })
  ],
  providers: [
    {provide:'apiUrl',useValue:'https://localhost:7297/api/'},
    {provide:APP_BASE_HREF,useValue:'/'},
    [DatePipe]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
