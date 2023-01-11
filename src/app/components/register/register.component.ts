import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
registerform:FormGroup

constructor(private authservice:AuthService,private formbuilder:FormBuilder){

}


  ngOnInit(): void {
  }

  createRegisterForm(){
    this.registerform=this.formbuilder.group({

    })
  }

}
