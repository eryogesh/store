import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { HttpResponseHandlerService } from '../../../shared/async-services/http';
import { UtilityService } from '../../../shared/utility/utility.service';
import { AuthSandbox } from '../../services';

const kwSessionData = 'sessionData';
const kwUserDetails = 'USER_DETAILS';
const kwDownloadCategory = 'DownloadCategory';
const kwRecentCategory = 'RecentCategory';
const kwPROJECT_ID = 'PROJECT_ID';
const kwIS_USER = 'IS_USER';
const kwPreviousURL = 'previousURL';

@Component({
  selector: 'cs-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})

export class SessionComponent implements OnInit {
  private sessionData;
  private usrID = -1;
  private sesnID;
  private uniqID;
  private userDetails;
  public errorMessage: String;

  constructor(public utilityService: UtilityService,
    public authSandbox: AuthSandbox,
    private aRouter: ActivatedRoute,
    private router: Router,
    private responseHandler: HttpResponseHandlerService) {
    this.errorMessage = this.aRouter.snapshot.queryParamMap.get('errorMsg');
  }

  ngOnInit() {
    this.sessionData = JSON.parse(sessionStorage.getItem(kwSessionData));
    if (this.sessionData) {
      this.usrID = this.sessionData.userId;
      this.sesnID = this.sessionData.sessionId;
      this.uniqID = this.sessionData.uniqueId;
      this.utilityService.isLoggedIn$ = Observable.of(true);
    }
    this.userDetails = JSON.parse(sessionStorage.getItem(kwUserDetails));
  }

  public logout(): void {
    const data = { userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID };
    this.authSandbox.doLogout(data).subscribe(res => {
      this.resetVars();
      sessionStorage.removeItem(kwSessionData);
      sessionStorage.removeItem(kwDownloadCategory);
      sessionStorage.removeItem(kwRecentCategory);
      sessionStorage.removeItem(kwUserDetails);
      sessionStorage.removeItem(kwPROJECT_ID);
      sessionStorage.removeItem(kwIS_USER);
      sessionStorage.removeItem(kwPreviousURL);
      this.router.navigate(['/account/login']);
    },
      (error) => this.responseHandler.onCatch(error));
  }

  public resetVars(): void {
    this.utilityService.isRegister$ = null;
    this.utilityService.isAdmin$ = Observable.of(false);
    this.utilityService.isLoggedIn$ = Observable.of(false);
  }

}
