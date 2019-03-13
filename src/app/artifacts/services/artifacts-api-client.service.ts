import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpService } from '../../shared/async-services/http';
import { Artifact, ArtifactFaq, ArtifactReview, UploadTypes, TagResponse } from '../../shared/models';
import {
  ArtifactResponse,
  ArtifactSearchResponse,
  GetArtifactsPagingResponse,
  PostResponse,
  UpdateArtifactResponse,
  UploadArtifactFilesResponse,
  UploadArtifactResponse,
} from '../../shared/models/post-response.model';

@Injectable()
export class ArtifactsApiClientService extends HttpService {

  uniqueId: any;
  userId: any;
  sessionAuthKey: any;
  private url = this.getBaseUrl();
  public downloadUrl = this.getDownloadUrl();
  public envUrl = this.getEnvUrl();

  /**
   * @description Createin form data with user session detail
   */
  public sessionData() {
    const session = JSON.parse(sessionStorage.getItem('sessionData'));
    const formData = new FormData();
    if (session) {
      formData.append('userId', session.userId);
      formData.append('sessionAuthKey', session.sessionId);
      formData.append('uniqueId', session.uniqueId);
      return formData;
    }
  }

  /**
   * Retrieves artifacts list
   * @param data
   * @POST('/artifacts')
   * @Adapter(ArtifacesService.gridAdapter)
   */
  public getArtifacts(data): Observable<Artifact[]> {
    return this.http.post<Artifact[]>(this.url + '/showallproject2', data);
  }

  /**
   * @description Retrives artifacts list by paging
   * @param data
   */
  public getArtifactsWithPaging(data): Observable<GetArtifactsPagingResponse> {
    return this.http.post<GetArtifactsPagingResponse>(this.url + '/showallprojectswithpaging', data);
  }

  /**
   * @description Retrive favourite artifacts list
   */
  public getFavouriteArtifacts(): Observable<Artifact[]> {
    const fd = this.sessionData();
    return this.http.post<Artifact[]>(this.url + '/userFavProjects', fd);
  }

  /**
   * @description Retrive favourite artifacts list by paging.
   * @param data
   */
  public getFavouriteArtifactsWithPaging(data): Observable<GetArtifactsPagingResponse> {
    const fd = this.sessionData();
    fd.append('startIndex', data.startIndex);
    fd.append('pageSize', data.pageSize);
    return this.http.post<GetArtifactsPagingResponse>(this.url + '/userFavProjectsWithPaging', fd);
  }


  /**
 * Retrieves selected artifact details
 */
  // @POST('/artifacts', 'download')
  // @Adapter(ArtifacesService.gridAdapter)
  public getArtifactDetails(id, profileMapping, assetStatusId, isPublished): Observable<ArtifactResponse> {
    const fd = this.sessionData();
    fd.append('isUser', '1');
    fd.append('profileMapping', profileMapping);
    fd.append('assetStatusId', assetStatusId);
    fd.append('isPublished', isPublished);
    fd.append('projectId', id);
    return this.http.post<ArtifactResponse>(this.url + '/viewproject', fd);
  }
  /**
    * Update selected artifact details
      @POST('/editProject')
    */
  public updateArtifactDetails(selectedArtifactData: object): Observable<UpdateArtifactResponse> {
    const fd = this.sessionData();
    fd.append('isProjectFile', '1');
    fd.append('projectInfo', JSON.stringify(selectedArtifactData));
    return this.http.post<UpdateArtifactResponse>(this.url + '/editProject', fd);
  }
  /**
    * Retrieves selected artifact Review
   @POST('/projectreview')
    */
  public getProjectReview(data): Observable<ArtifactReview[]> {
    const fd = this.sessionData();
    fd.append('projectId', data);
    return this.http.post<ArtifactReview[]>(this.url + '/projectreview', fd);
  }
  /**
    * Post selected artifact Reviw
   @POST('/postReview')
    */
  public postProjectReview(data): Observable<PostResponse> {
    const fd = this.sessionData();
    fd.append('rating', data.rating);
    fd.append('reviewText', data.reviewText);
    fd.append('reviewId', data.reviewId);
    fd.append('projectId', data.projectId);

    return this.http.post<PostResponse>(this.url + '/postReview', fd);
  }
  /**
    * set selected artifact Favorite
   @POST('/setfavorite')
    */
  public setFavorite(data): Observable<PostResponse> {
    const fd = this.sessionData();
    fd.append('isFavorite', data.isFavorite);
    fd.append('projectId', data.projectId);

    return this.http.post<PostResponse>(this.url + '/setfavorite', fd);
  }
  /**
    * Retrieves selected artifact Queries
   @POST('/getQueries')
    */
  public getQuery(id): Observable<ArtifactFaq[]> {
    const fd = this.sessionData();
    fd.append('assetId', id);
    return this.http.post<ArtifactFaq[]>(this.url + '/getQueries', fd);
  }
  /**
    * Post selected artifact Queries
   @POST('/postQuery')
    */
  public postQuery(data): Observable<PostResponse> {
    const fd = this.sessionData();
    fd.append('assetId', data.assetId);
    fd.append('question', data.question);
    fd.append('toUserId', data.toUserId);
    fd.append('fromUserId', data.fromUserId);
    return this.http.post<PostResponse>(this.url + '/postQuery', fd);
  }
  /**
    * Retrieves user Details
   @POST('/userDetails')
    */
  public getUserDetails(): Observable<any> {
    const fd = this.sessionData();
    return this.http.post(this.url + '/userDetails', fd);
  }
  /**
    * Download selected artifact
   @POST('/assetDownload')
    */
  public downloadArtifact(data): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.url + '/assetDownload', data);
  }
  /**
    * Post FAQ Answer
   @POST('/postAnswer')
    */
  public postFaqAnswer(data): Observable<PostResponse> {
    const fd = new FormData();
    fd.append('answer', data.answer);
    fd.append('questionId', data.questionId);
    fd.append('assetId', data.assetId);
    fd.append('toUserId', data.toUserId);
    fd.append('fromUserId', data.fromUserId);
    fd.append('sessionAuthKey', data.sessionAuthKey);
    fd.append('uniqueId', data.uniqueId);
    return this.http.post<PostResponse>(this.url + '/postAnswer', fd);
  }
  /**
    * Retrieves Related artifact
   @POST('/searchProjectsbyName')
    */
  public getRelatedArtifact(data): Observable<ArtifactSearchResponse> {
    const fd = this.sessionData();
    fd.append('profileMapping', data.profileMapping);
    fd.append('searchString', data.searchString);
    fd.append('assetId', data.assetId);
    return this.http.post<ArtifactSearchResponse>(this.url + '/searchProjectsbyName', fd);
  }

  public getUploadTypes(): Observable<UploadTypes[]> {
    const fd = this.sessionData();
    return this.http.post<UploadTypes[]>(this.url + '/getformattypes', fd);
  }

  public getTagsList(data) :Observable<TagResponse>{
    const fd = data;
    //'http://capstore.fs.capgemini.com:4000/api/v1/other/getTags'
    return this.http.post<TagResponse>(this.envUrl+'/api/v1/other/getTags', fd);
  }

  public getEnvironmentUrl(){    
    return this.envUrl;
  }

  public saveProjectAndFile(saveData, fileIcon, isNewVersion): Observable<UploadArtifactResponse> { // Model to be defined
    const fd = this.sessionData();
    fd.append('file', fileIcon);
    fd.append('isProjectFile', '1');
    fd.append('projectInfo', JSON.stringify(saveData));
    fd.append('isNewVersion', isNewVersion);
    return this.http.post<UploadArtifactResponse>(this.url + '/saveProjectAndFile', fd);
  }

  public uploadProjectFiles(data): Observable<UploadArtifactFilesResponse> {
    const fd = data;
    return this.http.post<UploadArtifactFilesResponse>(this.url + '/uploadProjectFiles', fd);
  }
}
