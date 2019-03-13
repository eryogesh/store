import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthSandbox } from '../../services';
import { RegistrationForm, RegResponse, Message } from '../../../shared/models';
import { Router, ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'cs-resetpassword',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})


export class ResetPasswordComponent implements OnInit {
  form;
  msgs: Message[] = [];
  resetPasswordForm: FormGroup;
  userId: number;


  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private http: HttpClient, public authSandbox: AuthSandbox) {
    this.resetPasswordForm = this.fb.group({
      'email': new FormControl('', Validators.compose([Validators.required, isEmailValid('email')])),
      'password': new FormControl('', Validators.required),
      'confirmpassword': new FormControl('', Validators.required)

    });

    this.userId = this.activatedRoute.snapshot.queryParams["UID"];
    let uname = this.activatedRoute.snapshot.queryParams["uname"];
    this.resetPasswordForm.controls['email'].setValue(uname);



  }
  ngOnInit() {

  }

  onSubmit(resetForm: any) {
    resetForm.userId = this.userId;
    this.authSandbox.resetPassword(resetForm);
    this.authSandbox.resetPasswordResponse$.subscribe(data => {
      let response = new RegResponse(data);
      if (!response.status) {
        this.msgs.push({ severity: 'error', summary: 'Error', detail: response.msg });
      }
      else {
        this.msgs.push({ severity: 'success', summary: 'success', detail: response.status });

      }
    });
  }
}

function isEmailValid(control) {
  return control => {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(control.value) ? null : { invalidEmail: true };
  }
}


