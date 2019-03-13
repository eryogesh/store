import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DataScroller } from 'primeng/primeng';

import { AppSandbox } from '../../app.sandbox';
import { GlobalErrorHandler } from '../../error-handling/global-error-handler';
import { HttpResponseHandlerService } from '../../shared/async-services/http';
import { Artifact } from '../../shared/models';
import { UtilityService } from '../../shared/utility';
import { SearchSandbox } from '../services/search.sandbox';
declare var yam: any;
@Component({
  selector: 'cs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']

})
export class SearchComponent implements OnInit {
  copyArtifactUrlPopup: boolean;
  copyArtifactUrl: string;
  @ViewChild(DataScroller) dataScrollerComponent: DataScroller;
  public assetData: Artifact[] = [];
  public displayMessage = '';
  public noRecordFoundMsg = '';
  public totalRecords = 0;
  public searchString = '';
  public oldSearchString = '';

  constructor(private router: Router,
    public searchSandbox: SearchSandbox,
    private activateRoute: ActivatedRoute,
    public utilityService: UtilityService,
    private responseHandler: HttpResponseHandlerService,
    private confirmationService: ConfirmationService,
    private globalErrorHandler: GlobalErrorHandler,
    private appSandbox: AppSandbox) {
  }

  ngOnInit(): void {
    this.searchLang();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.searchLang();
    });
    this.activateRoute.params.subscribe(params => {
      this.searchString = params.searchString;
      this.totalRecords = 1;
      this.assetData = [];
      this.dataScrollerComponent.reset();
      this.dataScrollerComponent.ngOnInit();       
    }, error => this.globalErrorHandler.handleError(error));
    this.dataScrollerComponent.reset();
    this.dataScrollerComponent.ngOnInit(); 
    this.dataScrollerComponent.page=0;    
  }
  private searchLang() {
    this.appSandbox.translate.get('artifact-list.NoRecordFound').subscribe((res: string) => {
      this.noRecordFoundMsg = res;
    });
  }
  loadData(event) {

    
    this.searchSandbox.searchArtifact(this.searchString, event.first, event.rows)
      .subscribe(response => {
        if ((this.totalRecords + event.rows) > response.totalCount) {
          this.totalRecords = response.totalCount;
        } else {
            this.totalRecords += response.project_results && response.project_results.length + 1;
        }

        if (response.project_results && response.project_results.length) {
          this.displayMessage = '';
           this.assetData.push(...response.project_results);
        } else {
          if (!response.project_results) {
            this.assetData = [];
            this.displayMessage = this.noRecordFoundMsg;
          } else if (response.project_results.length <= 0) {

            this.assetData = [];
            this.displayMessage = this.noRecordFoundMsg;
          }

          if (response.totalCount != undefined && this.totalRecords !== response.totalCount && response.project_results.length > 0) {
            this.assetData = [];
            this.displayMessage = this.noRecordFoundMsg;
          }


        }
      }, error => this.responseHandler.onCatch(error));
  }

  public viewProject(projId: string, assetStatusId: string, isPublished: string): void {
    sessionStorage.setItem('PROJECT_ID', projId);
    sessionStorage.setItem('asset_Status', assetStatusId);
    sessionStorage.setItem('ispublished', isPublished);
    this.router.navigate(['./artifacts/artifact-details/' + projId]);
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

}
