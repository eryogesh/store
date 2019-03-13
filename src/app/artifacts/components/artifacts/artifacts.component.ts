import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Message } from 'primeng/api';
import { DataScroller, SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';

import { AppSandbox } from '../../../app.sandbox';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { HttpResponseHandlerService } from '../../../shared/async-services/http';
import { Artifact, GetArtifactsPagingResponse } from '../../../shared/models';
import { CategoriesDetails } from '../../../shared/models/categories/category.model';
import { UtilityService } from '../../../shared/utility';
import { ArtifactsSandbox } from '../../services/artifacts.sandbox';

declare var jquery: any;
declare var $: any;
declare var yam: any;
declare var ga: Function;


@Component({
  selector: 'cs-artifacts',
  templateUrl: './artifacts.component.html',
  styleUrls: ['./artifacts.component.css']
})
export class ArtifactsComponent implements OnInit {
  copyArtifactUrlPopup: boolean;
  copyArtifactUrl: string;
  @ViewChild(DataScroller) dataScrollerComponent: DataScroller;
  public assetData: Artifact[] = [];
  private recentAssets: Artifact[] = [];
  private popularAssets: Artifact[] = [];
  private favouritesAssets: Artifact[] = [];
  public assets: SelectItem[] = [];
  public types: SelectItem[] = [];
  public selectedType: string;
  public selectedAsset: string;
  public display = false;
  public projectType: String;
  private active: string;
  private subcategories: any[];
  private selectedCategories: string[] = [];
  public displayMessage = '';
  private categoriesCheck: any = [];
  private session = JSON.parse(sessionStorage.getItem('sessionData'));
  private artifactsResult$: Observable<GetArtifactsPagingResponse> = Observable.of(new GetArtifactsPagingResponse());
  private recentStartIndex = 0;
  private popularStartIndex = 0;
  private favStartIndex = 0;
  private pageSize = 12;
  private allProjects = [];
  public noRecordFoundMsg = '';
  public popularLabel = '';
  public recentLabel = '';
  public favouritesLabel = '';

  msgs: Message[] = [];
  public totalRecords = 0;

  constructor(
    private router: Router,
    public utilityService: UtilityService,
    public artifactsSandbox: ArtifactsSandbox,
    private globalErrorHandler: GlobalErrorHandler,
    private responseHandler: HttpResponseHandlerService, private appSandbox: AppSandbox) {
    // this.artifactsSandbox.loadArtifacts();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
      });
    }

  /**
   * @description loadArtifacts will lazy load call on scroll artifact list item.
   * @param event
   */
  public loadArtifacts(event): void {
    if (this.projectType === this.recentLabel) {
      this.artifactsResult$ = this.artifactsSandbox.getRecentProjects(event.first, event.rows);
    } else if (this.projectType === this.favouritesLabel) {
      this.artifactsResult$ = this.artifactsSandbox.getFavouriteArtifactsWithPaging(event.first, event.rows);
    } else {
      this.artifactsResult$ = this.artifactsSandbox.getPopularProjectsWithPaging(event.first, event.rows, this.selectedType);
    }
    this.artifactsResult$.subscribe(response => {
      if ((this.totalRecords + event.rows) > response.totalCount) {
        this.totalRecords = response.totalCount;
      } else {
        this.totalRecords += response.projects.length + 1;
      }

      if (response.projects && response.projects.length) {
        this.assetData.push(...response.projects);
      } else {
        if ( response.totalCount===0){
          this.assetData = [];
          this.displayMessage = this.noRecordFoundMsg;
        }
        
      }
    }, error => this.responseHandler.onCatch(error));
  }

  /**
   * @description setting flag to show category popup dialog.
   * @param event
   * @param category
   */
  public ngOnInit() {
      this.types = [
        { label: 'All', value: '' },
        { label: 'Mobile Apps', value: 'app' },
        { label: 'Other', value: 'nonapp' },
      ];

    this.projectType = 'Popular';
    sessionStorage.setItem('selectedCategoriesList', '[]');
    if (this.assets && this.assets.length <= 0) {
      this.artifactLang();
    }
    this.appSandbox.translate.onLangChange.subscribe(() => {
      if (this.assets.length > 0) {
        this.artifactLang();
      }
    });
  }

  copyToClipboard(activeCopyURL: boolean): void {
    this.copyArtifactUrl = document.location.href;
    this.copyArtifactUrlPopup = activeCopyURL;
  }

  public yammerWindowPopup(ownername, prjName): void {
    this.copyToClipboard(false);
    yam.platform.yammerShareOpenPopup({
      customButton: true,
      defaultMessage: this.getYammerWindowPopupMessage(ownername, prjName),
      pageUrl: this.copyArtifactUrl.split('?')[0]
    });
  }

  private getYammerWindowPopupMessage(ownername, prjName): string {
    const projectName = prjName.replace(/\s/g, '%20');
    const ownerName = decodeURI(ownername).replace(/<\/?[^>]+(>|$)/g, '').replace(/%26amp%3B/g, '&');
    return projectName + ' --- ' + ownerName;
  }

  /**
   * @description language update call
   */
  private artifactLang(): void {
    this.assets = [];
    this.appSandbox.translate.get('artifact-list.NoRecordFound').subscribe((res: string) => {
      this.noRecordFoundMsg = res;
    });
    if (this.session) {
      this.appSandbox.translate.get('artifact-list.Popular').subscribe((res: string) => {
        this.popularLabel = res;
        this.assets.push({ label: this.popularLabel, value: this.popularLabel });
        this.selectedAsset = this.popularLabel;
      });
      this.appSandbox.translate.get('artifact-list.Recent').subscribe((res: string) => {
        this.recentLabel = res;
        this.assets.push({ label: this.recentLabel, value: this.recentLabel });
      });
      this.appSandbox.translate.get('artifact-list.Favourites').subscribe((res: string) => {
        this.favouritesLabel = res;
        this.assets.push({ label: this.favouritesLabel, value: this.favouritesLabel });
      });
    } else {
      this.appSandbox.translate.get('artifact-list.Popular').subscribe((res: string) => {
        this.popularLabel = res;
        this.assets.push({ label: this.popularLabel, value: this.popularLabel });
        this.selectedAsset = this.popularLabel;
      });
      this.appSandbox.translate.get('artifact-list.Recent').subscribe((res: string) => {
        this.recentLabel = res;
        this.assets.push({ label: this.recentLabel, value: this.recentLabel });
      });
    }
  }

  /**
   * @description checking project type like - recent, popular or favourite.
   * @param value
   */
  public checkedAssets(value): void {
    this.selectedAsset = value;
    this.dataScrollerComponent.page = 1;
    this.totalRecords = 1;
    this.projectType = value;
    if (value === this.popularLabel) {
      this.assetData = [];
      this.popularAssets = [];
      this.artifactsSandbox.getPopularProjectsWithPaging(this.popularStartIndex, 12, this.selectedType)
      .subscribe((data: GetArtifactsPagingResponse) => {
        if (data) {
          this.totalRecords = data.projects.length + 1;
          if (data.totalCount > 0) {
            this.assetData = data.projects;
            this.popularAssets = data.projects;
            this.displayMessage = '';
          } else {
            this.assetData = [];
            this.popularAssets = [];
            this.displayMessage = this.noRecordFoundMsg;
          }
        }
      }, error => this.responseHandler.onCatch(error));
    } else if (value === this.recentLabel) {
      this.assetData = [];
      this.recentAssets = [];
      this.artifactsSandbox.getRecentProjects(this.recentStartIndex, 12, this.selectedType)
      .subscribe((data: GetArtifactsPagingResponse) => {
        if (data) {
          this.totalRecords = data.projects.length + 1;
          if (data.totalCount > 0) {
            this.assetData = data.projects;
            this.recentAssets = data.projects;
            this.displayMessage = '';
          } else {
            this.assetData = [];
            this.recentAssets = [];
            this.displayMessage = this.noRecordFoundMsg;
          }
        }
      }, error => this.responseHandler.onCatch(error));
    } else if (value === this.favouritesLabel) {
      this.assetData = [];
      this.favouritesAssets = [];
      if (this.session) {
        this.artifactsSandbox.getFavouriteArtifactsWithPaging(this.favStartIndex, this.pageSize)
          .subscribe((data: GetArtifactsPagingResponse) => {
            this.totalRecords = data.projects.length + 1;
            if (data.totalCount > 0) {
              this.assetData = data.projects;
              this.favouritesAssets = data.projects;
              this.displayMessage = '';
            } else {
              this.assetData = [];
              this.favouritesAssets = [];
              this.displayMessage = this.noRecordFoundMsg;
            }
          }, error => this.responseHandler.onCatch(error));
      } else {
        this.assetData = [];
        this.displayMessage = this.noRecordFoundMsg;
      }
    }
  }

  public checkedType(type): void {
    this.selectedType = type;
    this.checkedAssets(this.selectedAsset);
  }

  /**
   * @description updateing sub category flag to show and hide them.
   * @param event
   * @param category
   */
  private showSubCat(event, category: string): void {
    if (event && this.active !== category) {
      this.active = category;
    } else {
      this.active = null;
    }
  }

  /**
   * @description show project details
   * @param projId
   * @param assetStatusId
   * @param isPublished
   */
  private viewProject(projId: string, assetStatusId: string, isPublished: string): void {
    sessionStorage.setItem('PROJECT_ID', projId);
    sessionStorage.setItem('asset_Status', assetStatusId);
    sessionStorage.setItem('ispublished', isPublished);
    const viewProject = {
      projId: '',
      assetStatusId: '',
      isPublished: '',
    };
    viewProject.projId = projId;
    viewProject.assetStatusId = assetStatusId;
    viewProject.isPublished = isPublished;
    this.router.navigate(['./artifacts/artifact-details/' + viewProject.projId]);
  }

  /**
   * @description updating category dialog flag
   */
  public showDialog(): void {
    this.display = true;
  }

  /**
   * @description generating cagetory details to filter projects
   * @param categoryList - containg list of categories and subcategories
   * @param tag - contain tag value like 'recent' or 'download'
   */
  private getCategoryDetails(categoryList: string, tag: string): CategoriesDetails {
    const profileMapping = sessionStorage.getItem('PROFILE_ID');
    const categoryDetails = new CategoriesDetails();
    categoryDetails.catIds = categoryList;
    categoryDetails.tag = tag;
    categoryDetails.profileMapping = profileMapping ? profileMapping : 'DY';
    if (this.utilityService.getSessionData()) {
      categoryDetails.userId = this.utilityService.getSessionData().userId;
      categoryDetails.uniqueId = this.utilityService.getSessionData().uniqueId;
      categoryDetails.sessionAuthKey = this.utilityService.getSessionData().sessionId;
    } else {
      categoryDetails.userId = '-1';
    }
    return categoryDetails;
  }

  /**
   * @description this call : get artifacts list based on selection of categories and sub categories
   */
  public showResult(): void {
    let selectedCategoriesList = [];
    const selectedCategory = {
      catID: '',
      listSubCategories: []
    };
    const selectedSubCatId = {
      catID: ''
    };

    const getUserPref = JSON.parse(sessionStorage.getItem('DownloadCategory'));
    if (this.selectedCategories && this.selectedCategories.length !== 0) {
      for (let i = 0, ilen = this.selectedCategories.length; i < ilen; ++i) {
        const catId = JSON.parse(this.selectedCategories[i]).catParentId;
        selectedSubCatId.catID = JSON.parse(this.selectedCategories[i]).catID;
        if (selectedCategory.catID !== catId && selectedCategory.catID !== '') {
          selectedCategoriesList.push(Object.assign({}, selectedCategory));
          selectedCategory.catID = '';
          selectedCategory.listSubCategories = [];
        }
        selectedCategory.catID = catId;
        selectedCategory.listSubCategories.push(Object.assign({}, selectedSubCatId));
      }
      selectedCategoriesList.push(selectedCategory);
    } else if (getUserPref) {
      selectedCategoriesList = getUserPref;
    } else {
      selectedCategoriesList = [];
    }
    this.assetData = [];
    sessionStorage.setItem('selectedCategoriesList', JSON.stringify(selectedCategoriesList));
    // -- page reset for scroll bar
    this.dataScrollerComponent.page = 1;
    this.totalRecords = 0;
    if (this.projectType === this.popularLabel) {
      this.getPopularProjectByCategory();
    }

    if (this.projectType === this.recentLabel) {
      this.getRecentProjectByCategory();
    }
    this.display = false;
  }

  /**
   *@description get popular project filered by category.
   */
  private getPopularProjectByCategory(): void {
    this.artifactsResult$ = this.artifactsSandbox.getPopularProjectsWithPaging();
    this.artifactsResult$.subscribe((data: GetArtifactsPagingResponse) => {
      if (data) {
        this.totalRecords = data.projects.length + 1;
        if (data.projects && data.projects.length > 0) {
          if (this.assetData) {
            this.assetData.push(...data.projects);
          } else {
            this.assetData = data.projects;
          }
          this.displayMessage = '';
        } else {
          this.assetData = [];
          this.displayMessage = this.noRecordFoundMsg;
        }
      }
    }, error => this.responseHandler.onCatch(error));
  }

  /**
   *@description get resent project filered by category.
   */
  private getRecentProjectByCategory(): void {
    this.artifactsResult$ = this.artifactsSandbox.getRecentProjects();
    this.artifactsResult$.subscribe((data: GetArtifactsPagingResponse) => {
      if (data) {
        this.totalRecords = data.projects.length + 1;
        if (data.projects && data.projects.length > 0) {
          if (this.assetData) {
            this.assetData.push(...data.projects);
          } else {
            this.assetData = data.projects;
          }
          this.displayMessage = '';
        } else {
          this.assetData = [];
          this.displayMessage = this.noRecordFoundMsg;
        }
      }
    }, (error) => this.responseHandler.onCatch(error));
  }

  /**
   * @description updating active flag for subcategory in category dialog popup.
   * @param catUniqueId
   * @param option
   * @param event
   */
  private updateCheckedOptions(catUniqueId, option, event): void {
    const selectedCategyStr: string = JSON.stringify(option);
    const index: number = this.selectedCategories.indexOf(selectedCategyStr);

    if (event.target.checked) {
      option.isActive = 1;
    } else {
      option.isActive = 0;
    }

    if (event.target.checked) {
      if (index === -1) {
        this.selectedCategories.push(selectedCategyStr);
        this.categoriesCheck.push(JSON.parse(selectedCategyStr));
      }
    } else {
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
        this.categoriesCheck.splice(index, 1);
      }
    }
  }

  /**
   *@description remove all filter from category filter list.
   */
  public removeAllFilter(): void {
    if (this.categoriesCheck) {
      for (let i = 0; i < this.categoriesCheck.length; i++) {
        const items = document.getElementById('checkBox-' + this.categoriesCheck[i].catID + '-' + this.categoriesCheck[i].catParentId);
        $('#' + items.id).prop('checked', false);
      }
      this.selectedCategories = [];
      this.categoriesCheck = [];
    }
  }

}
