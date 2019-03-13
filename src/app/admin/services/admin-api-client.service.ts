import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpService } from '../../shared/async-services/http';
import { Artifact, Category } from '../../shared/models';
import { AssetApproval } from '../../shared/models/admin/asset-approval.modal';
import { UserApprovals } from '../../shared/models/admin/user-approvals.modal';
import { UserAccessSearchEmailResponse } from '../../shared/models/admin/user-access-search-email.modal';
import { UserProfiles } from '../../shared/models/admin/user-profiles.modal';
import { UserRole } from '../../shared/models/admin/user-roles.modal';
import { CategoriesResponse } from '../../shared/models/categories/categories-response.model';
import { PostResponse, ArtifactResponse } from '../../shared/models/post-response.model';

@Injectable()
export class AdminApiClientService extends HttpService {
  public downloadUrl = this.getDownloadUrl();
  private url = this.getBaseUrl() + '/getCategories';
  private url1 = this.getBaseUrl() + '/createCategory';
  private url2 = this.getBaseUrl() + '/updateCategoryStatus';
  private url3 = this.getBaseUrl() + '/updateCategory';
  private url4 = this.getBaseUrl() + '/getUsersToApprove';
  private url5 = this.getBaseUrl() + '/getUserRoles';
  private url6 = this.getBaseUrl() + '/getUserProfiles';
  private url7 = this.getBaseUrl() + '/saveApprovedUsers';
  private url8 = this.getBaseUrl() + '/getAssetsToApprove';
  private url9 = this.getBaseUrl() + '/viewproject';
  private url10 = this.getBaseUrl() + '/userDetails';
  private url11 = this.getBaseUrl() + '/assetDownload';
  private url12 = this.getBaseUrl() + '/deleteAsset';
  private url13 = this.getBaseUrl() + '/saveApprovedAssets';


  public getCategories(): Observable<CategoriesResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('parentCatId', '0');
    fd.append('isActive', '1');
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<CategoriesResponse>(this.url, fd);
  }

  public getAllsubCategories(): Observable<Category[]> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('parentCatId', '-1');
    fd.append('isActive', '1');
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<Category[]>(this.url, fd);
  }

  public createCategory(data): Observable<PostResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('categoryName', data.categoryName);
    fd.append('parentCatId', data.parentCatId);
    fd.append('isActive', '1');
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<PostResponse>(this.url1, fd);

  }
  public updateCategoryStatus(data): Observable<PostResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('catIds', data.catIds);
    fd.append('isActive', '0');
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<PostResponse>(this.url2, fd);

  }
  public updateSubcategoryStatus(data): Observable<PostResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('parentCatId', data.parentCatId);
    fd.append('subCatIds', data.subCatIds);
    fd.append('isActive', '1');
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<PostResponse>(this.url3, fd);
  }

  public getUsersToApprove(): Observable<UserApprovals[]> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    fd.append('searchEmail', '');
    return this.http.post<UserApprovals[]>(this.url4, fd);
  }

  public getUserRoles(): Observable<UserRole[]> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<UserRole[]>(this.url5, fd);
  }
  public getUserProfiles(): Observable<UserProfiles[]> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<UserProfiles[]>(this.url6, fd);
  }
  public getEmailUserAccessData(data): Observable<UserAccessSearchEmailResponse[]> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    fd.append('searchEmail', data.searchEmail);
    return this.http.post<UserAccessSearchEmailResponse[]>(this.url4, fd);
  }
  public approveUser(data): Observable<PostResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    fd.append('approveeId', data.approveeId);
    fd.append('userRole', data.userRole);
    fd.append('userProfile', data.userProfile);
    return this.http.post<PostResponse>(this.url7, fd);
  }
  public getAssetsToapprove(): Observable<Artifact[]> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<Artifact[]>(this.url8, fd);
  }
  public getAssetDetails(id): Observable<ArtifactResponse> {

    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    const fd = new FormData();
    fd.append('isUser', '0');
    fd.append('assetStatusId', 'SU');
    fd.append('isPublished', '0');
    fd.append('projectId', id);
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);

    return this.http.post<ArtifactResponse>(this.url9, fd);
  }
  public downloadArtifact(data): Observable<any> {
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    const fd = new FormData();
    fd.append('userType', data.userType);
    fd.append('assetId', data.assetId);
    fd.append('projectName', data.projectName);
    fd.append('clientName', data.clientName);
    fd.append('projectId', data.projectId);
    fd.append('spadeId', data.spadeId);
    fd.append('effortsSaved', data.effortsSaved);
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post(this.url11, fd);

  }

  public DeleteAsset(data): Observable<PostResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('assetId', data.assetId);
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<PostResponse>(this.url12, fd);

  }
  public saveApprovedAssets(data): Observable<PostResponse> {
    const fd = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    fd.append('projectId', data.projectId);
    fd.append('reviewerRemarks', data.reviewerRemarks);
    fd.append('statusId', data.statusId);
    fd.append('profileMapping', data.profileMapping);
    fd.append('catId', data.catId);
    fd.append('userId', sessionData.userId);
    fd.append('sessionAuthKey', sessionData.sessionId);
    fd.append('uniqueId', sessionData.uniqueId);
    return this.http.post<PostResponse>(this.url13, fd);

  }
}
