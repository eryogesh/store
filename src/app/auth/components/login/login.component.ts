import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AppSandbox } from '../../../app.sandbox';
import { LoginForm, Message, UserDetailsResponse, UserSessionModel } from '../../../shared/models';
import { UtilityService } from '../../../shared/utility';
import { AuthSandbox } from '../../services';

const kwPreviousURL = 'previousURL';
@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  public errorMsg = '';
  public nameErrorMsg = '';
  public userEmailareInvalid = '';
  public domainErrorMsg = '';
  loginForm: FormGroup;
  msgs: Message[] = [];
  userNamePattern = /^[A-Za-z0-9._-]{3,}$/;
  domainPattern = /capgemini.com|es|fr$/;
  emailPattern = /^[A-Za-z0-9._-]+@capgemini.com|es|fr$/;
  constructor(private _location: Location,
    private router: Router,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    public authSandbox: AuthSandbox, private appSandbox: AppSandbox) {

    this.loginForm = this.fb.group({
      'email': new FormControl('')
    });
    this.loginLang();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.loginLang();
    });

    // -- Email Validater for officeal email
    this.loginForm.get('email').valueChanges.subscribe(val => {
      const userName = val.split('@');
      let domainRegx;
      const userNameRegx = this.userNamePattern.test(userName[0]) ? null : { invalidEmail: true };
      if (userNameRegx) {
        if (this.msgs.length) {
          this.msgs.pop();
          this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: this.nameErrorMsg });
        } else {
          this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: this.nameErrorMsg });
        }
        return;
      }

      if (userName[1]) {
        domainRegx = this.domainPattern.test(userName[1]) ? null : { invalidEmail: true };
        if (domainRegx) {
          if (this.msgs.length) {
            this.msgs.pop();
            this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: this.domainErrorMsg });
          } else {
            this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: this.domainErrorMsg });
          }
          return;
        }
      }

      const emailRegx = this.emailPattern.test(val) ? null : { invalidEmail: true };
      if (emailRegx) {
        if (this.msgs.length) {
          this.msgs.pop();
          this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: this.userEmailareInvalid });
        } else {
          this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: this.userEmailareInvalid });
        }
      }

      if (!userNameRegx && !emailRegx && !domainRegx && this.msgs.length || !val) {
        this.msgs.pop();
      }
    });

  }

  private loginLang() {

    this.appSandbox.translate.get('Auth.Login.Error').subscribe((res: string) => {
      this.errorMsg = res;
    });
    this.appSandbox.translate.get('Auth.Login.NameErrorMsg').subscribe((res: string) => {
      this.nameErrorMsg = res;
    });
    this.appSandbox.translate.get('Auth.Login.UserEmailareInvalid').subscribe((res: string) => {
      this.userEmailareInvalid = res;
    });
    this.appSandbox.translate.get('Auth.Login.DomainErrorMsg').subscribe((res: string) => {
      this.domainErrorMsg = res;
    });
  }
  public onSubmit(loginForm: any): void {
    const loginDetail: LoginForm = new LoginForm(loginForm);
    const uuid = this.utilityService.generateUUID();
    this.authSandbox.loginUser(loginDetail, uuid);
    this.authSandbox.userDetail$.subscribe(data => {
      const userObject = new UserSessionModel(data);
      if (userObject.userValid) {
        if (userObject.userId === -1) {
          this.utilityService.isLoggedIn$ = Observable.of(false);
        } else {
          const sessionData = {
            userId: userObject.userId,
            sessionId: userObject.session_auth_key,
            uniqueId: uuid
          };
          sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
          this.utilityService.setSessionData(sessionData);
          this.utilityService.isLoggedIn$ = Observable.of(true);
          this.getUser(sessionData.userId, sessionData.sessionId, sessionData.uniqueId);
        }
      } else {
        if (this.msgs.length) {
          this.msgs.pop();
          this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: userObject.msg });
        } else {
          this.msgs.push({ severity: 'error', summary: this.errorMsg, detail: userObject.msg });
        }
      }
    });
  }

  private navigateToPreviousLocation(): void {
    const previousURL = sessionStorage.getItem(kwPreviousURL);
    const isSessionPage = previousURL ? sessionStorage.getItem(kwPreviousURL).includes('session') : false;
    const isLoginPage = previousURL ? sessionStorage.getItem(kwPreviousURL).includes('login') : false;
    if (previousURL && !isSessionPage && !isLoginPage) {
      if (previousURL.includes('artifact-details')) {
        const projectId = previousURL.split('projectId=')[1];
        const url = projectId ? '/artifacts/artifact-details/' + projectId : previousURL;
        this.router.navigate([url]);
      } else {
        this.router.navigate([sessionStorage.getItem(kwPreviousURL)]);
      }
    } else {
      this.router.navigate(['/categories']);
    }
  }

  private getUser(usrID, sesnID, uniqID): void {
    const data = { userId: usrID, session_auth_key: sesnID, uniqueId: uniqID };
    const userSessionModel = new UserSessionModel(data);
    this.authSandbox.getUser(userSessionModel);
    this.authSandbox.userSessionDetail$.subscribe((res: UserDetailsResponse) => {
      const userDetails = res.user;

      sessionStorage.setItem('PROFILE_ID', userDetails.userAccess.profileId);

      if (userDetails && userDetails.categoryPrefs) {
        userDetails.categoryPrefs = JSON.parse(userDetails.categoryPrefs);
        if (JSON.parse(sessionStorage.getItem('GetPref'))) {
          sessionStorage.setItem('DownloadCategory', JSON.stringify(userDetails.categoryPrefs));
          sessionStorage.setItem('RecentCategory', JSON.stringify(userDetails.categoryPrefs));
          sessionStorage.setItem('GetPref', JSON.stringify(false));
        }
      }
      if (userDetails && userDetails.profileImage) {
        const imgUrl = userDetails.profileImage;
        userDetails.profileImage = this.authSandbox.downloadUrl + '' + imgUrl.replace(/\\/g, '/');
        this.utilityService.profileImage$ = Observable.of(userDetails.profileImage);
      }
      if (userDetails && userDetails.name) {
        this.utilityService.userName$ = Observable.of(userDetails.name.substring(0, 10) + '..');
        this.utilityService.titleName$ = Observable.of(userDetails.name);
      }
      if (userDetails && userDetails.designation) {
        this.utilityService.designation$ = Observable.of(userDetails.designation.substring(0, 10));
        this.utilityService.tileDesignation$ = Observable.of(userDetails.designation);
      }

      const profileId = userDetails.userAccess.profileId;
      const roleId = userDetails.userAccess.roleId;

      // -- setting user details in store
      sessionStorage.setItem('USER_DETAILS', JSON.stringify(userDetails));
      sessionStorage.setItem('PROFILE_ID', profileId);
      sessionStorage.setItem('ROLE_ID', roleId);
      // -- setting flag for admin user check
      if (this.utilityService.isLoggedIn$ && ((roleId === 'AD' && profileId === 'AP') || (roleId === 'SA'))) {
        this.utilityService.isAdmin$ = Observable.of(true);
      } else {
        this.utilityService.isAdmin$ = Observable.of(false);
      }

      // --- navigate to privious location
      this.navigateToPreviousLocation();

    });
  }
}


