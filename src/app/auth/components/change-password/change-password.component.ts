import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthSandbox } from '../../services';
import { RegistrationForm, RegResponse, Message } from '../../../shared/models';

@Component({
  selector: 'cs-changepassword',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})


export class ChangePasswordComponent implements OnInit {

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
      if (!response.status) {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: response.msg });
      } else {
        this.msgs.push({ severity: 'success', summary: 'success', detail: response.status });

      }
    });
  }
}

function isEmailValid(control) {
  return control => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(control.value) ? null : { invalidEmail: true };
  };
}


