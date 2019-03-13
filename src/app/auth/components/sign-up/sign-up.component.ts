import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Message, RegistrationForm, RegResponse } from '../../../shared/models';
import { UtilityService } from '../../../shared/utility/utility.service';
import { AuthSandbox } from '../../services';
import { AppSandbox } from '../../../app.sandbox';

@Component({
  selector: 'cs-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form;
  public values: any;
  public msgs: Message[] = [];
  public userform: FormGroup;
  public submitted: boolean;
  public description: string;
  public errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public authSandbox: AuthSandbox,
    public utilityService: UtilityService, private appSandbox: AppSandbox
  ) {
    this.userform = this.fb.group({
      email: new FormControl('',
        Validators.compose([Validators.required, isEmailValid('email')])
      ),
      fullname: new FormControl(
        '',
        Validators.compose([isFullnameAndDesig('designation')])
      ),
      password: new FormControl(''),
      designation: new FormControl(
        '',
        Validators.compose([isFullnameAndDesig('designation')])
      )
    });
  }

  ngOnInit() {
    this.signupLang();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.signupLang();
    });
    this.utilityService.resetObservable$.subscribe(res => {
      this.userform.reset({
        fullname: '',
        password: '',
        designation: ''
      });
      this.msgs = [];
    });
  }

  resetFields(){
    this.userform.reset({
      fullname: '',
      password: '',
      designation: ''
    });
    this.msgs = [];
  }


  private signupLang() {
    this.appSandbox.translate.get('Auth.Register.Error').subscribe((res: string) => {
      this.errorMsg = res;
    });
  }
  onSubmit(value: string) {
    this.submitted = true;
    const registrationForm = new RegistrationForm(value);
    this.authSandbox.registerUser(registrationForm);
    this.authSandbox.registrationResponse$.subscribe(data => {
      const response = new RegResponse(data);
      if (response.status) {
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: '',
          detail: response.msg
        });
      } else {
        this.msgs = [];
        this.msgs.push({
          severity: 'error',
          summary: this.errorMsg,
          detail: response.msg
        });
      }
    });
  }

  register() { }
}

function isEmailValid(control) {
  // tslint:disable-next-line:no-shadowed-variable
  return control => {
    // tslint:disable-next-line:max-line-length
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(control.value) ? null : { invalidEmail: true };
  };
}

function isFullnameAndDesig(control) {
  // tslint:disable-next-line:no-shadowed-variable
  return control => {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(control.value) ? null : { invalidFNameandDesig: true };
  };
}
