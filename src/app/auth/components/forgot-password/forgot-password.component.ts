import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Message, RegResponse } from '../../../shared/models';
import { AuthSandbox } from '../../services';




@Component({
  selector: 'cs-forgotpassword',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})


export class ForgotPasswordComponent implements OnInit {

  form;
  msgs: Message[] = [];
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, public authSandbox: AuthSandbox) {
    this.forgotPasswordForm = this.fb.group({
      'email': new FormControl('', Validators.compose([Validators.required, isEmailValid('email')]))
    });

  }
  ngOnInit() {


  }

  onSubmit(userId: any) {
    this.authSandbox.forgotPassword(userId.email);
    this.authSandbox.forgotPasswordResponse$.subscribe(data => {
      const response = new RegResponse(data);
      if (response.status) {
        this.msgs.push({ severity: 'success', summary: 'Success', detail: response.status });
      } else {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: response.status });

      }
    });
  }
}

function isEmailValid(control) {
  // tslint:disable-next-line:no-shadowed-variable
  return control => {
    // tslint:disable-next-line:max-line-length
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(control.value) ? null : { invalidEmail: true };
  };
}


