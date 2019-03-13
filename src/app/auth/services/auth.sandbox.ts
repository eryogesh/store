import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
  Artifact,
  Category,
  LoginForm,
  RegistrationForm,
  RegResponse,
  UserData,
  UserDetails,
  UserSessionModel,
  UserDetailsResponse,
} from '../../shared/models';
import { PostResponse, UploadUserImageResponse } from '../../shared/models/post-response.model';
import { Sandbox } from '../../shared/sandbox/base.sandbox';
import { UtilityService } from './../../shared/utility/utility.service';
import { AuthApiClientService } from './auth-api-client.service';

const kwPreviousURL = 'previousURL';
@Injectable()
export class AuthSandbox extends Sandbox {
  private subscriptions: Array<Subscription> = [];
  public userDetail$: Observable<UserSessionModel>;
  public userSessionDetail$: Observable<UserDetailsResponse>;
  public registrationResponse$: Observable<RegResponse[]>;
  public forgotPasswordResponse$: Observable<RegResponse[]>;
  public resetPasswordResponse$: Observable<RegResponse[]>;
  public userFavouriteArtifacts$: Observable<Artifact[]>;
  public userUploadArtifacts$: Observable<Artifact[]>;
  public userDownloadArtifacts$: Observable<Artifact[]>;
  public uploadUserProfileImage$: Observable<UploadUserImageResponse>;
  public downloadUrl: string;
  public editUserProfile$: Observable<PostResponse>;
  public allCategories$: Observable<Category[]>;
  public updateUserCategoriesPrefs$: Observable<PostResponse>;
  public getLoggedUser$: Observable<UserData>;
  public userDetailsHeader$: Observable<UserSessionModel>;

  constructor(
    private authApiClientService: AuthApiClientService,
    private utilityService: UtilityService,
    private router: Router
  ) {
    super();
    this.downloadUrl = authApiClientService.downloadUrl;
    this.registerEvents();
  }

  public loginUser(loginForm: LoginForm, uuid: any): void {
    this.userDetail$ = this.authApiClientService.checkSSO(loginForm, uuid);
  }

  public doLogout(data: any): Observable<UserSessionModel> {
    return this.authApiClientService.doLogout(data);
  }

  public registerUser(registrationForm: RegistrationForm): void {
    this.registrationResponse$ = this.authApiClientService.registration(
      registrationForm
    );
  }

  public forgotPassword(userId: string): void {
    this.forgotPasswordResponse$ = this.authApiClientService.forgotPassword(
      userId
    );
  }

  public resetPassword(resetForm: any): void {
    this.resetPasswordResponse$ = this.authApiClientService.resetPassword(
      resetForm
    );
  }

  public getUser(userSession: UserSessionModel): void {
    this.userSessionDetail$ = this.authApiClientService.getUser(userSession);
  }
  /**
   * Get user uploaded artifacts : from userUploadArtifacts call.
   * @param data : request param.
   */
  public userUploadArtifacts(): void {
    this.userUploadArtifacts$ = this.authApiClientService.getUserUploadArtifacts();
  }
  /**
   * Get user downloaded artifacts : from userDownloadArtifacts call.
   * @param data : request param.
   */
  public userDownloadArtifacts(): void {
    this.userDownloadArtifacts$ = this.authApiClientService.getUserDownloadArtifacts();
  }
  /**
   * Post user profile image : from uploadUserProfileImage call.
   * @param data : request param.
   */
  public uploadUserProfileImage(fileData: object): void {
    this.uploadUserProfileImage$ = this.authApiClientService.uploadUserProfileImage(
      fileData
    );
  }
  /**
 * Post user update details : from editUserData call.
 * @param data : request param.
 */
  public editUserData(userData: object): void {
    this.editUserProfile$ = this.authApiClientService.editUserProfile(userData);
  }
  /**
 * Get categories: from showAllCategories call.
 * @param data : request param.
 */
  public showAllCategories(): void {
    this.allCategories$ = this.authApiClientService.showAllCategories();
  }
  /**
   * Get logged in user deatils : from getLoggedUserData call.
   * @param data : request param.
   */
  public getLoggedUserData(): void {
    this.getLoggedUser$ = this.authApiClientService.getUserDetails();
  }
  /**
   * Post user category preference : from updateUserCategoriesPrefs call.
   * @param data : request param.
   */
  public updateUserCategoriesPrefs(data: object): void {
    this.updateUserCategoriesPrefs$ = this.authApiClientService.updateUserCategoriesPrefs(
      data
    );
  }
  /**
   * Get user favourite artifacts : from userFavouriteArtifacts call.
   * @param data : request param.
   */
  public userFavouriteArtifacts(): void {
    this.userFavouriteArtifacts$ = this.authApiClientService.getFavouriteArtifacts();
  }

  /**
   * Loads user artifacts from the server
   */
  public loadUserArtifacts(): void {
    this.downloadUrl = this.authApiClientService.downloadUrl;
  }

  /**
   * Unsubscribes from events
   */
  public unregisterEvents() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Subscribes to events
   */
  private registerEvents(): void {
    // // Subscribes to culture
    // this.subscriptions.push(this.culture$.subscribe((culture: string) => this.culture = culture));
    const session = JSON.parse(sessionStorage.getItem('sessionData'));
    if (session) {
      this.loadUserArtifacts();
    }
  }

  generateUUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        // tslint:disable-next-line:no-bitwise
        const r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        // tslint:disable-next-line:no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  getUserDetailsHeader(uuid: string): void {
    this.userDetailsHeader$ = this.authApiClientService.getUserDetailsHeader(
      uuid
    );
  }

  public getUserDetails(usrID, sesnID, uniqID): void {
    const data = { userId: usrID, session_auth_key: sesnID, uniqueId: uniqID };
    const userSessionModel = new UserSessionModel(data);
    this.getUser(userSessionModel);
    this.userSessionDetail$.subscribe((res: UserDetailsResponse) => {
      const userDetails = res.user;
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
        userDetails.profileImage = this.downloadUrl + '' + imgUrl.replace(/\\/g, '/');
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
      // this._location.back();
      // Nevigate to previous url.
      this.navigateToPreviousLocation();
    });
  }

  private navigateToPreviousLocation(): void {
    const previousURL = sessionStorage.getItem(kwPreviousURL);
    const isSessionPage = previousURL ? sessionStorage.getItem(kwPreviousURL).includes('session') : false;
    const isLoginPage = previousURL ? sessionStorage.getItem(kwPreviousURL).includes('login') : false;
    if (previousURL && !isSessionPage && !isLoginPage) {
      this.router.navigate([sessionStorage.getItem(kwPreviousURL)]);
    } else {
      this.router.navigate(['/categories']);
    }
  }
}

