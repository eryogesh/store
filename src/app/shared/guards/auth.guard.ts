import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UtilityService } from '../utility/utility.service';
import { AuthApiClientService } from './../../auth/services/auth-api-client.service';
import { AuthSandbox } from './../../auth/services/auth.sandbox';

const kwPreviousURL = 'previousURL';
@Injectable()
export class AuthGuard implements CanActivate {
  returnValue: boolean;
  constructor(
    private router: Router,
    private utilityService: UtilityService,
    public authSandbox: AuthSandbox,
    private authApiClientService: AuthApiClientService

  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const allowUnAuthAccess = route.data['allowUnAuthAccess'];
    const IsSSOEnabled = this.utilityService.getIsSSOEnabled();
    if (IsSSOEnabled) {
      sessionStorage.setItem(kwPreviousURL, state.url);
    }
    return this.checkLogin(state.url, allowUnAuthAccess);
  }

  checkLogin(url: string, allowUnAuthAccess: boolean): Observable<boolean> {
    const currentUser = JSON.parse(sessionStorage.getItem('sessionData'));

    if (currentUser) {
      return Observable.of(true);
    } else {
      const IsSSOEnabled = this.utilityService.getIsSSOEnabled();
      if (IsSSOEnabled) {
        const uuid = this.utilityService.generateUUID();
        this.authSandbox.getUserDetailsHeader(uuid);

        return this.authSandbox.userDetailsHeader$.map(userSessionObject => {
          if (userSessionObject) {
            if (userSessionObject.userValid) {
              if (userSessionObject.userId === -1) {
                this.utilityService.isLoggedIn$ = Observable.of(false);
                if (allowUnAuthAccess) {
                  return true;
                }
                // this.headerComponent.registration();
                this.utilityService.isRegister$ = Observable.of(true);
                return false;
              } else {
                const sessionData = {
                  userId: userSessionObject.userId,
                  sessionId: userSessionObject.session_auth_key,
                  uniqueId: uuid
                };
                sessionStorage.setItem(
                  'sessionData',
                  JSON.stringify(sessionData)
                );
                this.utilityService.setSessionData(sessionData);
                this.authSandbox.getUserDetails(userSessionObject.userId, userSessionObject.session_auth_key, uuid);
                this.authSandbox.userSessionDetail$.subscribe(res => {
                  this.utilityService.isLoggedIn$ = Observable.of(true);
                  // return true;
                });
              }
            } else {
              if (allowUnAuthAccess) {
                return true;
              }
              //
              // this.headerComponent.registration();
              // this.router.navigate(["/account/signup"]);
              this.utilityService.isRegister$ = Observable.of(true);
              return false;
            }
          } else {
            if (allowUnAuthAccess) {
              return true;
            }
            // this.headerComponent.registration();
            this.utilityService.isRegister$ = Observable.of(true);
            return false;
          }
        });
      } else {
        if (allowUnAuthAccess) {
          return Observable.of(true);
        }
        // Navigate to the login page with extras
        this.router.navigate(['/account/login']);
        return Observable.of(false);
      }
    }
  }
}
