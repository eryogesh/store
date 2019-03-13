import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpService,
  Adapter,
  Path,
  POST,
  DefaultHeaders
} from '../../shared/async-services/http';
import { Observable } from 'rxjs/Observable';
import {
  UserSessionModel,
  RegistrationForm,
  RegResponse,
  User,
  Artifact,
  PostResponse,
  Category,
  UserData
} from '../../shared/models';
import { RequestOptions, Headers } from '@angular/http';
import * as shajs from 'sha.js';
import { UploadUserImageResponse } from '../../shared/models/post-response.model';
import { UserDetails, LoginForm, UserDetailsResponse } from '../../shared/models/auth/login.model';

@Injectable()
@DefaultHeaders({
  Accept: 'application/json',
  'Content-Type': 'application/json'
})
export class AuthApiClientService extends HttpService {
  private url = this.getBaseUrl();
  session: any = [];
  public downloadUrl = this.getDownloadUrl();
  public checkSSO(userdata: any, uuid: any): Observable<UserSessionModel> {
    const loginData = new FormData();
    loginData.append('username', userdata.email);
    if (userdata.password) {
      // loginData.append('password', this.encryptPassword(userdata.password));
      loginData.append('password', userdata.password);
    } else {
      loginData.append('password', '');
    }

    loginData.append('uniqueId', uuid);
    return this.http.post<UserSessionModel>(
      this.url + '/doAuthenticate',
      loginData
    );
  }

  public doLogout(data: any): Observable<UserSessionModel> {
    const fd = this.sessionData();
    return this.http.post<UserSessionModel>(this.url + '/doLogout', fd);
  }

  public registration(user: RegistrationForm): Observable<RegResponse[]> {
    const registrationData = new FormData();
    registrationData.append('username', user.email);
    if (user.password) {
      registrationData.append('password', this.encryptPassword(user.password));
    } else {
      registrationData.append('password', '');
    }
    registrationData.append('fullName', user.fullname);
    registrationData.append('shortId', null);
    registrationData.append('designation', user.designation);
    return this.http.post<RegResponse[]>(
      this.url + '/registerUser',
      registrationData
    );
  }

  public forgotPassword(username: string): Observable<RegResponse[]> {
    const forgotPasswordData = new FormData();
    forgotPasswordData.append('username', username);
    return this.http.post<RegResponse[]>(
      this.url + '/forgotPassword',
      forgotPasswordData
    );
  }

  public resetPassword(resetForm: any): Observable<RegResponse[]> {
    const resetPassData = new FormData();
    resetPassData.append('username', resetForm.email);

    resetPassData.append('password', this.encryptPassword(resetForm.password));

    resetPassData.append('userId', resetForm.userId);
    return this.http.post<RegResponse[]>(
      this.url + '/resetPassword',
      resetPassData
    );
  }

  public getUser(usersession: UserSessionModel): Observable<UserDetailsResponse> {
    const userData = new FormData();
    userData.append('userId', usersession.userId.toString());
    userData.append('sessionAuthKey', usersession.session_auth_key);
    userData.append('uniqueId', usersession.uniqueId);

    return this.http.post<UserDetailsResponse>(this.url + '/userDetails', userData);
  }

  private encryptPassword(password: string) {
    let val;
    val = shajs('sha256')
      .update(password)
      .digest('hex');
    return val;
  }

  public sessionData() {
    this.session = JSON.parse(sessionStorage.getItem('sessionData'));
    const formData = new FormData();
    if (this.session) {
      formData.append('userId', this.session.userId);
      formData.append('sessionAuthKey', this.session.sessionId);
      formData.append('uniqueId', this.session.uniqueId);
      return formData;
    } else {
      return formData;
    }
  }

  public getFavouriteArtifacts(): Observable<Artifact[]> {
    const fd = this.sessionData();
    return this.http.post<Artifact[]>(this.url + '/userFavProjects', fd);
  }

  public getUserUploadArtifacts(): Observable<Artifact[]> {
    const fd = this.sessionData();
    return this.http.post<Artifact[]>(this.url + '/getUserUploadProjects', fd);
  }

  public getUserDownloadArtifacts(): Observable<Artifact[]> {
    const fd = this.sessionData();
    return this.http.post<Artifact[]>(this.url + '/getUserDownloadedAssets', fd);
  }

  public uploadUserProfileImage(fileData): Observable<UploadUserImageResponse> {
    const fd = this.sessionData();
    fd.append('dirId', this.session.userId);
    fd.append('file', fileData.file);
    fd.append('size', fileData.size);

    return this.http.post<UploadUserImageResponse>(
      this.url + '/updateProfilePic',
      fd
    );
  }

  public getUserDetails(): Observable<UserData> {
    const fd = this.sessionData();
    return this.http.post<UserData>(this.url + '/userDetails', fd);
  }

  public editUserProfile(userData): Observable<PostResponse> {
    const fd = new FormData();
    fd.append('username', userData.username);
    fd.append('designation', userData.designation);
    fd.append('userId', userData.userId);
    return this.http.post<PostResponse>(this.url + '/editProfile', fd);
  }

  public showAllCategories(): Observable<Category[]> {
    const fd = this.sessionData();
    return this.http.post<Category[]>(this.url + '/showallcategories', fd);
  }

  public updateUserCategoriesPrefs(data): Observable<PostResponse> {
    const fd = this.sessionData();
    fd.append('categoryPrefs', data.categoryPrefs);
    return this.http.post<PostResponse>(this.url + '/updateUserCatPrefs', fd);
  }

  // IsSSOEnabled -
  public getUserDetailsHeader(uuid): Observable<UserSessionModel> {
  const url = this.configService.get('api').baseUrl + '/doAuthenticateSSO';
    const formData = new FormData();
    formData.append('uniqueId', uuid);
    return this.http.post<UserSessionModel>(url, formData);
  }
}
