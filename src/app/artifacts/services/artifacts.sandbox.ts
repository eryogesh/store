import 'rxjs/add/operator/finally';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CategoriesApiClientService } from '../../categories/services/categories-api-client.service';
import { GlobalErrorHandler } from '../../error-handling/global-error-handler';
import {
  Artifact,
  ArtifactFaq,
  ArtifactResponse,
  ArtifactReview,
  ArtifactSearchResponse,
  Category,
  GetArtifactsPagingResponse,
  PostResponse,
  UpdateArtifactResponse,
  UploadArtifactFilesResponse,
  UploadArtifactResponse,
  UploadTypes,
  User,
  UserAccess,
  UserDetails,
  TagResponse
} from '../../shared/models';
import { Sandbox } from '../../shared/sandbox/base.sandbox';
import { UtilityService } from '../../shared/utility';
import { ArtifactsApiClientService } from './artifacts-api-client.service';

const kwUserDetails = 'USER_DETAILS';
const kwIsUser = 'IS_USER';
const kwDownloadCategory = 'DownloadCategory';
const kwRecentCategory = 'RecentCategory';

@Injectable()
export class ArtifactsSandbox extends Sandbox {
  public popularArtifacts$: Observable<GetArtifactsPagingResponse>;
  public recentArtifacts$: Observable<GetArtifactsPagingResponse>;
  public favouriteArtifacts$: Observable<Artifact[]>;
  public topDownloadArtifacts$: Observable<GetArtifactsPagingResponse>;

  public allCategories$: Observable<Category[]>;
  public artifactDetails$: Observable<ArtifactResponse>;
  public artifactReviewsList$: Observable<ArtifactReview[]>;
  public artifactReviewPost$: Observable<PostResponse>;
  public setFavorite$: Observable<PostResponse>;
  public updateArtifactDetails$: Observable<UpdateArtifactResponse>;
  public getQuery$: Observable<ArtifactFaq[]>;
  public postQuery$: Observable<PostResponse>;
  public userDetails$;
  public download$: Observable<PostResponse>;
  public faqAnswer$: Observable<PostResponse>;
  public downloadUrl: string;
  public relatedArtifact$: Observable<ArtifactSearchResponse>;
  public projectSave$: Observable<UploadArtifactResponse>;
  public projectFiles$: Observable<UploadArtifactFilesResponse>;
  public artifactsUploadtype$: Observable<UploadTypes[]>;
  public uploadTagsList$: Observable<TagResponse>;
  // public loggedUser$ = Observable.of<User>(new User(JSON.parse(sessionStorage.getItem('currentUser'))));

  private subscriptions: Array<Subscription> = [];

  private downloadCategory: string;
  private recentCategory: string;
  private categoryPrefs: string;
  private usrID = -1;
  private sesnID: string;
  private uniqID: string;

  private userAccess: UserAccess = {
    profileId: '',
    userRole: '',
    roleId: '',
    userProfile: '',
    userId: '-1'
  };

  private userDetails: UserDetails = {
    shortID: '',
    lastLogin: '',
    emailID: '',
    profileImage: '../../../assets/images/user-icon.png',
    isActive: '',
    categoryPrefs: '',
    userID: 1,
    userAccess: this.userAccess,
    name: '',
    isApproved: 0,
    designation: '',
  };

  constructor(
    // protected appState$: Store<store.State>,
    private artifactsApiClient: ArtifactsApiClientService,
    private categoriesApiClientService: CategoriesApiClientService,
    private globalErrorHandler: GlobalErrorHandler,
    private utilityService: UtilityService
  ) {
    super();
    this.registerEvents();
  }

  /**
   * Loads categories from the server
   */
  public loadArtifacts(): void {
    const sessionData = this.utilityService.getSessionData();
    if (sessionData) {
      this.usrID = sessionData.userId;
      this.sesnID = sessionData.sessionId;
      this.uniqID = sessionData.uniqueId;
    }
    const isUser = '1';
    sessionStorage.setItem(kwIsUser, JSON.parse(isUser));

    this.allCategories$ = this.categoriesApiClientService.showallCategories();
    this.downloadUrl = this.artifactsApiClient.downloadUrl;
    const userData = sessionStorage.getItem(kwUserDetails);
    if (userData) {
      this.userDetails = JSON.parse(userData);
      this.categoryPrefs = this.userDetails.categoryPrefs ? JSON.stringify(this.userDetails.categoryPrefs) : '[]';
    } else {
      this.categoryPrefs = '[]';
    }

    this.downloadCategory = sessionStorage.getItem(kwDownloadCategory);
    this.recentCategory = sessionStorage.getItem(kwRecentCategory);

    // if (this.sesnID) {
    //   this.getPopularProjects();
    //   // this.getRecentProjects();
    //   // this.getFavouriteProjects(JSON.stringify(this.categoryPrefs);
    //   // this.getTopDownloadProjects();
    // } else {
    //   this.getPopularProjects();
    //   // this.getRecentProjects();
    //   // this.getTopDownloadProjects();
    // }

    // -- get popular projects function call to get initial load data for artifacts list.
    this.getPopularProjectsWithPaging();

  }

  public getPopularProjectsWithPaging(startIndex: number = 0, pageSize: number = 12, type: string = ''):
  Observable<GetArtifactsPagingResponse> {
    let selectedCategory = sessionStorage.getItem('selectedCategoriesList');
    if (!sessionStorage) {
      if (this.sesnID) {
        selectedCategory = this.categoryPrefs;
      } else {
        selectedCategory = this.downloadCategory;
      }
    } else if ( !selectedCategory || selectedCategory === '[]' || (selectedCategory && JSON.parse(selectedCategory).length === 0)) {
      selectedCategory = sessionStorage.getItem('DownloadCategory');
    }

    if (!JSON.parse(selectedCategory)) {
      selectedCategory = '[]';
    }
    if (!this.userDetails || this.userDetails.userAccess.profileId === 'AP') {
      this.userDetails.userAccess.profileId = '';
    }
    const data = {
      tag: 'download', catIds: selectedCategory, type: type,
      profileMapping: this.userDetails.userAccess.profileId, userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID,
      startIndex: startIndex, pageSize: pageSize
    };
    return this.getPopularArtifactsWithPaging(data);
  }


  /**
   * Get all recent artifacts : from getProjectRecent call.
   * @param selectedCategory : cantain request JSON data to get response.
   */
  public getRecentProjects(startIndex: number = 0, pageSize: number = 12, type: string = ''): Observable<GetArtifactsPagingResponse> {
    let selectedCategory = sessionStorage.getItem('selectedCategoriesList');
    if (!selectedCategory) {
      if (this.sesnID) {
        selectedCategory = this.categoryPrefs;
      } else {
        selectedCategory = this.downloadCategory;
      }
    }

    if (!JSON.parse(selectedCategory)) {
      selectedCategory = '[]';
    }
    if (!this.userDetails || !this.userDetails.userAccess || this.userDetails.userAccess.profileId === 'AP') {
      this.userDetails.userAccess.profileId = '';
    }

    const data = {
      tag: 'recent', catIds: selectedCategory, type: type,
      profileMapping: this.userDetails.userAccess.profileId, userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID,
      startIndex: startIndex, pageSize: pageSize
    };
    return this.getRecentArtifacts(data);
  }


  /**
   * @description Get all popular artifact by paging.
   * @param data
   */
  private getPopularArtifactsWithPaging(data): Observable<GetArtifactsPagingResponse> {
    return this.artifactsApiClient.getArtifactsWithPaging(data);
  }

  /**
   * Get all recent artifacts : from getRecentArtifacts call.
   * @param data : request param.
   */
  public getRecentArtifacts(data): Observable<GetArtifactsPagingResponse> {
    return this.artifactsApiClient.getArtifactsWithPaging(data);
  }

  /**
   * Get all most favourite artifacts : from getFavouriteArtifacts call.
   * @param data : request param.
   */
  public getFavouriteArtifactsWithPaging(startIndex: number = 0, pageSize: number = 12): Observable<GetArtifactsPagingResponse> {
    const data = { startIndex: startIndex, pageSize: pageSize };
    return this.artifactsApiClient.getFavouriteArtifactsWithPaging(data);
  }

  /**
   *@description OLD CODE BACKUP COMMENT AS BELOW //
   */

  /**
   * Get popular artifacts : from getProjectTopDownload call.
   * @param selectedCategory : cantain request JSON data to get response.
   */
  // public getPopularProjects(startIndex: number = 0, pageSize: number = 12): Observable<GetArtifactsPagingResponse> {
  //   let selectedCategory: any;
  //   if (this.sesnID) {
  //     selectedCategory = this.categoryPrefs;
  //   } else {
  //     selectedCategory = this.downloadCategory;
  //   }

  //   if (!JSON.parse(selectedCategory)) {
  //     selectedCategory = '[]';
  //   }
  //   if (!this.userDetails || !this.userDetails.userAccess || this.userDetails.userAccess.profileId === 'AP') {
  //     this.userDetails.userAccess.profileId = '';
  //   }
  //   const data = {
  //     tag: 'download', catIds: selectedCategory,
  //     profileMapping: this.userDetails.userAccess.profileId, userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID,
  //     startIndex: startIndex, pageSize: pageSize
  //   };
  //   return this.getPopularArtifacts(data);
  // }


  /**
   * Get all popular artifacts : from getPopularArtifacts call.
   * @param data : request param.
   */
  // private getTopDownloadProjects(startIndex: number = 0, pageSize: number = 12): Observable<GetArtifactsPagingResponse> {
  //   if (!this.userDetails || !this.userDetails.userAccess || this.userDetails.userAccess.profileId === 'AP') {
  //     this.userDetails.userAccess.profileId = '';
  //   }
  //   const data = {
  //     tag: 'download', isLastThirtyDays: 1, catIds: '[]',
  //     profileMapping: this.userDetails.userAccess.profileId, userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID,
  //     startIndex: startIndex, pageSize: pageSize
  //   };
  //   // -- service call to get last month top downloads artifacts.
  //   return this.getTopDownlodArtifacts(data);
  // }

  /**
   * @description : getFavouriteProjects
   */
  // private getFavouriteProjects(selectedCategory): void {
  //   if (!JSON.parse(selectedCategory)) {
  //     selectedCategory = '[]';
  //   }
  //   if (!this.userDetails || !this.userDetails.userAccess || this.userDetails.userAccess.profileId === 'AP') {
  //     this.userDetails.userAccess.profileId = '';
  //   }
  //   const data = {
  //     tag: 'download', catIds: selectedCategory,
  //     profileMapping: this.userDetails.userAccess.profileId, userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID
  //   };

  //   // this.getFavouriteArtifacts(data);
  // }

  /**
   * Get all popular artifacts : from getPopularArtifacts call.
   * @param data : request param.
   */
  // public getPopularArtifacts(data): Observable<GetArtifactsPagingResponse> {
  //   return this.artifactsApiClient.getArtifactsWithPaging(data);
  // }

  /**
   * Get all most favourite artifacts : from getFavouriteArtifacts call.
   * @param data : request param.
   */
  // private getFavouriteArtifacts(): Observable<GetArtifactsPagingResponse> {
  //   // data.isLastThirtyDays = 1;
  //   // this.favouriteArtifacts$ = this.artifactsApiClient.getArtifacts(data);
  //   return this.artifactsApiClient.getFavArtifacts();
  // }


  // public userFavouriteArtifacts(): void {
  //   this.favouriteArtifacts$ = this.artifactsApiClient.getFavouriteArtifacts();
  // }

  /**
   * Get last month top downloades artifacts : from getFavouriteArtifacts call.
   * @param data : request param.
   */
  // public getTopDownlodArtifacts(data): Observable<GetArtifactsPagingResponse> {
  //   if (this.usrID) { data.userId = this.usrID; }
  //   this.topDownloadArtifacts$ = this.artifactsApiClient.getArtifactsWithPaging(data);
  //   return this.topDownloadArtifacts$;
  // }

  /**
   *@description OLD CODE BACKUP AS COMMENT ABOVE //
   */

  /**
   * Get selected artifacts details: from artifactDetails call.
   * @param data : request param.
   */
  public artifactDetails(id: number, profileMapping: string, assetStatusId: string, isPublished: string): void {
    this.artifactDetails$ = this.artifactsApiClient.getArtifactDetails(id, profileMapping, assetStatusId, isPublished);
  }
  /**
   * Get selected artifacts review: from getProjectReview call.
   * @param data : request param.
   */
  public artifactReview(projId: number): void {
    this.artifactReviewsList$ = this.artifactsApiClient.getProjectReview(projId);
  }
  /**
   * Update artifacts details: from updateArtifactDetails call.
   * @param data : request param.
   */
  public updateArtifactDetails(form_data: object): void {
    this.updateArtifactDetails$ = this.artifactsApiClient.updateArtifactDetails(form_data);
  }
  /**
   * Post artifacts reviews: from postProjectReview call.
   * @param data : request param.
   */
  public postProjectReview(form_data: object): void {
    this.artifactReviewPost$ = this.artifactsApiClient.postProjectReview(form_data);
  }
  /**
   * Post artifacts Favorite: from setFavorite call.
   * @param data : request param.
   */
  public setFavorite(form_data: object): void {
    this.setFavorite$ = this.artifactsApiClient.setFavorite(form_data);
  }
  /**
   * Get selected artifact queries : from getQuery call.
   * @param data : request param.
   */
  public getQuery(id): void {
    this.getQuery$ = this.artifactsApiClient.getQuery(id);
  }
  /**
   * Post selected artifact queries : from postQuery call.
   * @param data : request param.
   */
  public postQuery(form_data: object): void {
    this.postQuery$ = this.artifactsApiClient.postQuery(form_data);
  }
  /**
   * Download artifact : from downloadArtifact call.
   * @param data : request param.
   */
  public downloadArtifact(form_data: object): void {
    this.download$ = this.artifactsApiClient.downloadArtifact(form_data);
  }
  /**
   * Post user query answer : from postFaqAnswer call.
   * @param data : request param.
   */
  public postFaqAnswer(form_data: object): void {
    this.faqAnswer$ = this.artifactsApiClient.postFaqAnswer(form_data);
  }
  /**
   * Get related artifacrs : from getRelatedArtifact call.
   * @param data : request param.
   */
  public getRelatedArtifact(form_data: object): void {
    this.relatedArtifact$ = this.artifactsApiClient.getRelatedArtifact(form_data);
  }
  /**
   * Get artifacrs uploaded type: from getUploadTypes call.
   * @param data : request param.
   */
  public getUploadTypes(): void {
    this.artifactsUploadtype$ = this.artifactsApiClient.getUploadTypes();
  }
  /**
   * Get tag list: from getTagsList call.
   * @param data : request param.
   */
  public getTagsList(data):void {
    this.uploadTagsList$ = this.artifactsApiClient.getTagsList(data);
  }
  /**
   * Post uploaded artifacrs details: from saveProjectAndFile call.
   * @param data : request param.
   */
  public saveProjectAndFile(saveData: object, fileIcon: string, isNewVersion: number): void {
    this.projectSave$ = this.artifactsApiClient.saveProjectAndFile(saveData, fileIcon, isNewVersion);
  }
  /**
   * Post uploaded artifacrs files: from uploadProjectFiles call.
   * @param data : request param.
   */
  public uploadProjectFiles(data: object): void {
    this.projectFiles$ = this.artifactsApiClient.uploadProjectFiles(data);
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
    this.subscriptions.push(this.utilityService.getLoggedUser().subscribe((user: User) => {
      this.loadArtifacts();
    }));
  }
}
