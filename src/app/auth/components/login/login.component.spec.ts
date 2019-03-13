import { APP_BASE_HREF, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpHandler, HttpClientModule, HttpSentEvent } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateLoader, TranslateModule, TranslateParser, TranslateService } from 'ng2-translate';
import { ButtonModule } from 'primeng/components/button/button';
import { MessageService } from 'primeng/components/common/messageservice';
import { GrowlModule } from 'primeng/components/growl/growl';
import { MessagesModule } from 'primeng/messages';

import { ConfigService } from '../../../app-config.service';
import { AppSandbox } from '../../../app.sandbox';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { HttpResponseHandlerService } from '../../../shared/async-services/http';
import { UserSessionModel, LoginForm, UserAccess, UserDetails } from '../../../shared/models';
import { UtilityService } from '../../../shared/utility';
import { AuthApiClientService, AuthSandbox } from '../../services';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Message } from 'primeng/primeng';

@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

class RouterStub {
  navigateByUrl(url: string) {
    return url;
  }
}

class MockConfigService {
  get(key: any) {
    return key;
  }
}
class MockAuthApiClientService {
  checkSSO() {
    return '';
  }
}
export class MockAuthSandbox {
  public userDetails$: Observable<LoginForm>;
  public loginUser(loginForm: LoginForm, uuid: any): void {
  }
  public getUser(userSession: UserSessionModel): void {
  }
}
export class MockUtilityService {
  sessionData: any;
  public generateUUID(): string {
    return 'uuid';
  }
  public setSessionData(sessionData: any): void {
    this.sessionData = sessionData;
  }
}
const userAccess: UserAccess = {
  profileId: 'SL',
  userRole: 'SUPER_ADMIN',
  roleId: 'SA',
  userProfile: 'SALES',
  userId: '',
};

fdescribe('LoginComponent :', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, MockPipe],
      providers: [
        Location,
        { provide: Router, useValue: mockRouter },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
        UtilityService,
        AuthSandbox,
        AppSandbox,
        { provide: ConfigService, useClass: MockConfigService },
        AuthApiClientService,
        MessageService,
        HttpClient,
        HttpHandler,
        GlobalErrorHandler,
        NotificationsService,
        HttpResponseHandlerService,
        TranslateModule,
        TranslateService,
        TranslateLoader,
        TranslateParser, FormBuilder
      ],

      imports: [FormsModule, ReactiveFormsModule, GrowlModule, ButtonModule, MessagesModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should check initial input', () => {
    fixture.detectChanges();
    const email = component.loginForm.controls['email'];
    expect(email.value).toBe('');
  });

  it('Email Validater for offical email', () => {
    const userNamePattern = /^[A-Za-z0-9._-]{3,}$/;
    const domainPattern = /capgemini.com|es|fr$/;
    const emailPattern = /^[A-Za-z0-9._-]+@capgemini.com|es|fr$/;
    const email = component.loginForm.controls['email'];
    const val = 'yogesh**.patel@@';
    component.loginForm.get('email').valueChanges.subscribe(this.val);
    const userName = val.split('@');
    // tslint:disable-next-line:prefer-const
    let domainRegx;
    const userNameRegx = userNamePattern.test(userName[0]) ? null : { invalidEmail: true };
    domainRegx = domainPattern.test(userName[1]) ? null : { invalidEmail: true };
    const emailRegx = emailPattern.test(val) ? null : { invalidEmail: true };
  });

  it(' onSubmit should return  when submitted', inject([AuthSandbox, UtilityService], (authSandbox, utilityService) => {
    const loginForm: LoginForm = { 'email': 'Kanchan.kanchan@capgemini.com' };
    const uuid = '234235';
    const sessionModel = {
      msg: 'User Credentials are Valid',
      session_auth_key: 'eeaa4oaa3ueckvlpfofe004aoh',
      userValid: true,
      userId: 166,
      uniqueId: '',
    };
    spyOn(utilityService, 'generateUUID').and.returnValue(new MockUtilityService);
    spyOn(authSandbox, 'loginUser').and.returnValue(new MockAuthSandbox());
    component.authSandbox.userDetail$ = Observable.of(sessionModel);
    const userObject = new UserSessionModel(sessionModel);
    const sessionData = {
      userId: userObject.userId,
      sessionId: userObject.session_auth_key,
      uniqueId: uuid
    };
    const userDetailsData = {
      user: {
        shortID: '',
        lastLogin: '2018-02-22 18:26:12.0',
        emailID: 'yogesh.patel@capgemini.com',
        profileImage: '\\CapStore\\ProfilePics\\166\\Desert.jpg',
        isActive: 'T',
        categoryPrefs: '[{\"catID\":46,\"listSubCategories\":[]},{\"catID\":47,\"listSubCategories\":[]}]',
        userID: 166,
        userAccess: userAccess,
        name: 'Yogesh Patel',
        isApproved: 0,
        designation: 'Sr Manager',
        userProfileName: '',
        userRoleName: ''
      }
    };

    const data = {
      userId: 12,
      session_auth_key: '',
      uniqueId: ''
    };
    const userSessionModel = new UserSessionModel(data);
    spyOn(authSandbox, 'getUser').and.returnValue(new MockAuthSandbox());
    component.authSandbox.userSessionDetail$ = Observable.of(userDetailsData);
    component.onSubmit(loginForm);

  }));
});
