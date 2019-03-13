import { isBoolean } from 'util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { AppSandbox } from '../../../app.sandbox';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { Artifact, DownloadArtifactModel } from '../../../shared/models';
import { UserDetails } from '../../../shared/models/auth/login.model';
import { ArtifactResponse, PostResponse, UpdateArtifactResponse } from '../../../shared/models/post-response.model';
import { UtilityService } from '../../../shared/utility/utility.service';
import { ArtifactsSandbox } from '../../services/artifacts.sandbox';

declare var yam: any;

@Component({
  selector: 'cs-artifact-details',
  templateUrl: './artifact-details.component.html',
  styleUrls: ['./artifact-details.component.css']
})
export class ArtifactDetailsComponent implements OnInit {

  constructor(private router: Router,
    public utilityService: UtilityService,
    public artifactsSandbox: ArtifactsSandbox,
    private messageService: MessageService,
    private activateRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private globalErrorHandler: GlobalErrorHandler,
    public appsandbox: AppSandbox) {
    this.appsandbox.setupLanguage();
    this.activateRoute.params.subscribe(url => {
      document.documentElement.scrollTop = 0;
      this.selectedProjectId = url.id;
      this.assetStatusId = url.assetStatusId;
      this.isPublished = url.isPublished;
      if (this.relatedArtifactLoad === true) {
        this.tabIndex = 0;
        this.ngOnInit();
      }
    });
  }

  public PopupBlockerDisablePopup: Boolean = false;
  private kwUserDetails = 'USER_DETAILS';
  public downloadArtifactDetails = new DownloadArtifactModel();
  public loggedInUserDetails: UserDetails;
  public copyArtifactUrlPopup = false;
  public projectDataSize: string;
  public selectedProjectId: number;
  public assetStatusId: string;
  public isPublished: string;
  public selectedArtifactData: any = {};
  public description: string;
  public features: string;
  public fileType: string;
  public isEditBtn = false;
  public displayReview = false;
  public downloadProjectPopup = false;
  public isFavorite: number;
  public supportingFile = [];
  public isSupportFiles = false;
  public assetFiles = [];
  public isZipContent = false;
  public zipContent = [];
  public answer: string;
  public displayRelatedArtifacts = false;
  public projectArray = [];
  public isNewVersion: string;
  public hideNewVersionTemplate = true;
  public copyArtifactUrl: string;
  public descriptionEdit = false;
  public tagsEdit = false;
  public featuresEdit = false;
  public relatedArtifactLoad = false;
  private userNotAuthMsg: string;
  private projectInfoNot: string;
  private success: string;
  private error: string;
  private artifactUpdatedMsg: string;
  public tabIndex: number;


  session = JSON.parse(sessionStorage.getItem('sessionData'));
  sessionData = {
    userId: this.session.userId,
    sessionAuthKey: this.session.sessionId,
    uniqueId: this.session.uniqueId,
  };

  ngOnInit() {
    this.artifactDetLang();
    this.appsandbox.translate.onLangChange.subscribe(() => {
      this.artifactDetLang();
    });
    this.supportingFile = [];
    this.zipContent = [];
    this.isSupportFiles = false;
    this.isZipContent = false;
    this.loggedInUserDetails = JSON.parse(sessionStorage.getItem(this.kwUserDetails));
    this.getSelectedArtifactData();
  }
  private artifactDetLang() {
    this.appsandbox.translate.get('artifact-details.Message.userNotAuthMsg').subscribe((res: string) => {
      this.userNotAuthMsg = res;
    });
    this.appsandbox.translate.get('artifact-details.Message.ProjectInfoNot').subscribe((res: string) => {
      this.projectInfoNot = res;
    });
    this.appsandbox.translate.get('artifact-details.Message.Success').subscribe((res: string) => {
      this.success = res;
    });
    this.appsandbox.translate.get('artifact-details.Message.Error').subscribe((res: string) => {
      this.error = res;
    });
    this.appsandbox.translate.get('artifact-details.Message.ArtifactUpdatedMsg').subscribe((res: string) => {
      this.artifactUpdatedMsg = res;
    });
  }

  public yammerWindowPopup(): void {
    this.copyToClipboard(false);
    yam.platform.yammerShareOpenPopup({
      customButton: true,
      defaultMessage: this.getYammerWindowPopupMessage(),
      pageUrl: this.copyArtifactUrl.split('?')[0]
    });
  }

  // private getYammerWindowPopupMessage(): string {
  //   const projectName = this.selectedArtifactData.projectName.replace(/\s/g, '%20');
  //   const description = decodeURI(this.selectedArtifactData.description).replace(/<\/?[^>]+(>|$)/g, '').replace(/%26amp%3B/g, '&');
  //   return projectName + ' --- ' + description;
  // }

  private getYammerWindowPopupMessage(): string {
    const projectName = this.selectedArtifactData.projectName.replace(/\s/g, '%20');
    const descRemoveQuote = this.selectedArtifactData.description.replace(/&#34;/g, '"');
    const description = decodeURI(descRemoveQuote).replace(/<\/?[^>]+(>|$)/g, '').replace(/%26amp%3B/g, '&');
    return projectName + ' --- ' + description;
  }


  private getSelectedArtifactData(): void {
    const profileMapping = sessionStorage.getItem('PROFILE_ID');
    const assetStatusId = sessionStorage.getItem('asset_Status');
    const isPublished = sessionStorage.getItem('ispublished');

    this.supportingFile = [];
    this.zipContent = [];
    if (this.assetStatusId && this.isPublished) {
      sessionStorage.setItem('asset_Status', this.assetStatusId);
      sessionStorage.setItem('ispublished', this.isPublished);
      this.artifactsSandbox.artifactDetails(this.selectedProjectId, profileMapping, this.assetStatusId, this.isPublished);
    } else {
      this.artifactsSandbox.artifactDetails(this.selectedProjectId, profileMapping, assetStatusId, isPublished);
    }
    this.artifactsSandbox.artifactDetails$.subscribe((data: ArtifactResponse) => {
      if (data && data.status === false) {
        this.confirmationService.confirm({
          message: this.userNotAuthMsg,
          accept: () => {
            this.router.navigate(['./artifacts/artifact-list']);
          }
        });
      } else if (data && data.assetList && data.assetList.length > 0) {
        this.projectArray = data.assetList;
        // this code check the re-direction from list page to version page
        this.isNewVersion = sessionStorage.getItem('isNewVersion');
        if (this.isNewVersion === 'true') {
          this.hideNewVersionTemplate = false;
          this.isNewVersion = 'false';
          sessionStorage.setItem('isNewVersion', this.isNewVersion);
          this.selectedArtifactData = this.projectArray[0];

        } else {
          this.hideNewVersionTemplate = true;
          this.selectedArtifactData = this.projectArray[this.projectArray.length - 1];
        }

        this.description = decodeURIComponent(this.selectedArtifactData.description);
        this.features = decodeURIComponent(this.selectedArtifactData.features);
        this.isFavorite = this.selectedArtifactData.isFavorite;

        this.assetFiles = this.selectedArtifactData.assetSupportFiles;
        if (this.assetFiles) {
          for (let loop = 0, ilen = this.assetFiles.length; loop < ilen; loop++) {
            if (this.assetFiles[loop].isSupportFile === 1) {
              this.isSupportFiles = true;
              let assetUrl = this.assetFiles[loop].assetSupportFileName;
              assetUrl = assetUrl.replace(/\\/g, '/');
              assetUrl = this.artifactsSandbox.downloadUrl + assetUrl;
              this.assetFiles[loop].assetSupportFileName = assetUrl;
              this.supportingFile.push(this.assetFiles[loop]);
            } else {
              const zip = this.selectedArtifactData.assetSupportFiles[0].zipContents;
              if (zip !== '[]') {
                const zipContent = zip;
                this.zipContent = JSON.parse(zipContent);
                this.isZipContent = true;
              }
            }
          }

        }
        // type of file
        if (this.selectedArtifactData.projectPath === '') {
          this.fileType = '';
        } else {
          this.fileType = this.selectedArtifactData.projectPath.substr(this.selectedArtifactData.projectPath.lastIndexOf('.') + 1);
          this.fileType = this.fileType.toUpperCase();
        }
        // calculate size of project
        const prjSize = ((this.selectedArtifactData.size) / (1024 * 1024));
        this.projectDataSize = prjSize.toString();  // If it's not already a String

        if (this.selectedArtifactData.ownerImage) {
          this.selectedArtifactData.ownerImage = this.artifactsSandbox.downloadUrl +
            this.selectedArtifactData.ownerImage.replace(/\\/g, '/');
        }
      } else if (data && data.assetList.length === 0) {
        this.confirmationService.confirm({
          message: this.projectInfoNot,
          header: 'Information',
          icon: 'fa fa-info',
          accept: () => {
            this.router.navigate(['./artifacts/artifact-list']);
          },
          reject: () => { }
        });
      }
      this.getProjectImage();
    }, error => this.globalErrorHandler.handleError(error));
  }

  goVersionDetails(projectData: Artifact): void {
    this.isNewVersion = 'true';
    sessionStorage.setItem('isNewVersion', this.isNewVersion);
    this.router.navigate(['./artifacts/artifact-version-details/' + projectData.projId]);
  }

  getProjectImage(): void {
    if (!this.selectedArtifactData.imageUrl) {
      this.selectedArtifactData.imageUrl = 'assets/images/artifact/bmp.png';
    } else {
      this.selectedArtifactData.imageUrl = this.selectedArtifactData.imageUrl.replace(/ /g, '%20');
      if (this.selectedArtifactData.imageUrl) {
        this.selectedArtifactData.imageUrl =
          this.artifactsSandbox.downloadUrl + '' + this.selectedArtifactData.imageUrl.replace(/\\/g, '/');
      }
    }
  }

  onReviewTabEvent(event): void {
    if (event.index === 1) {
      this.displayReview = true;
      this.displayRelatedArtifacts = false;
    } else if (event.index === 2) {
      this.displayRelatedArtifacts = true;
      this.displayReview = false;
    }
  }

  onEditClickEvent(): void {
    this.isEditBtn = true;
  }

  setFavorite(): void {
    if (this.isFavorite === 1) {
      this.isFavorite = 0;
    } else {
      this.isFavorite = 1;
    }
    const favData = { projectId: this.selectedArtifactData.projId, isFavorite: this.isFavorite };
    this.artifactsSandbox.setFavorite(favData);
    this.artifactsSandbox.setFavorite$.subscribe((response: PostResponse) => {
      if (response && response.status === true) {
        this.messageService.add({ severity: 'success', summary: this.success, detail: response.msg });
      } else {
        if (this.isFavorite === 1) {
          this.isFavorite = 0;
        } else {
          this.isFavorite = 1;
        }
        this.messageService.add({ severity: 'error', summary: this.error, detail: response.msg });
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  updateArtifactDetails(): void {
    const form_data = {
      projectName: this.selectedArtifactData.projectName,
      tags: this.selectedArtifactData.tags,
      uploadType: this.selectedArtifactData.uploadType,
      categoryId: this.selectedArtifactData.categoryId,
      size: this.selectedArtifactData.size,
      subCategoryId: this.selectedArtifactData.subCategoryId,
      description: encodeURIComponent(this.description),
      features: encodeURIComponent(this.features),
      efforts: this.selectedArtifactData.effortsInvested,
      userId: this.sessionData.userId,
      sessionAuthKey: this.sessionData.sessionAuthKey,
      uniqueId: this.sessionData.uniqueId,
      versionName: this.selectedArtifactData.versionName,
      assetId: this.selectedArtifactData.projId,
      versionNo: this.selectedArtifactData.versionNo,
      isPublished: this.selectedArtifactData.assetStatusId
    };
    this.artifactsSandbox.updateArtifactDetails(form_data);
    this.artifactsSandbox.updateArtifactDetails$.subscribe((response: UpdateArtifactResponse) => {
      if (response && response.status === 'Success') {
        this.messageService.add({ severity: 'success', summary: this.success, detail: this.artifactUpdatedMsg });
        this.isEditBtn = false;
        this.getSelectedArtifactData();
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  cancelUpdate(): void {
    this.getSelectedArtifactData();
  }

  downloadArtifactPopup(): void {
    const defIsUser = JSON.parse(sessionStorage.getItem('IS_USER'));
    if (this.selectedArtifactData.userDownloaded === 0 && this.loggedInUserDetails.userAccess.userProfile === 'DELIVERY'
      && this.loggedInUserDetails.userAccess.profileId === 'DY' && defIsUser === 1) {
      this.downloadProjectPopup = true;
    } else {
      this.downloadedArtifactUrl();
    }
  }

  downloadArtifact(): void {
    // project download first time execute else block otherwise execute if block
    if (this.selectedArtifactData.userDownloaded === 0) {
      let projId = 0;
      let spadeid;
      let efforts = 0;
      let clientPrjName = '';

      if (this.loggedInUserDetails.userAccess.profileId === 'DY') {
        projId = this.selectedArtifactData.projId;
        spadeid = this.downloadArtifactDetails.projectId;
        efforts = this.downloadArtifactDetails.efforts;
        clientPrjName = this.downloadArtifactDetails.projectName;
      }
      const downloadData = {
        userType: this.loggedInUserDetails.userAccess.profileId, assetId: this.selectedArtifactData.projId,
        projectName: this.selectedArtifactData.projectName, clientName: clientPrjName, projectId: projId,
        spadeId: spadeid, effortsSaved: efforts, userId: this.sessionData.userId, sessionAuthKey: this.sessionData.sessionAuthKey,
        uniqueId: this.sessionData.uniqueId
      };
      this.artifactsSandbox.downloadArtifact(downloadData);
      this.artifactsSandbox.download$.subscribe((response: PostResponse) => {
        if (response && response.status === true) {
          this.selectedArtifactData.userDownloaded = 1;
          // this.downloadedArtifactUrl();
        }
      }, error => this.globalErrorHandler.handleError(error));

      const me = this;
      setTimeout(function () {
        if (me.selectedArtifactData.userDownloaded) {
          me.downloadedArtifactUrl();
        }
      }, 500);
    }
  }

  downloadedArtifactUrl(): void {
    // if (this.selectedArtifactData.userDownloaded) {
    let file = this.selectedArtifactData.projectPath;
    this.assetFiles = this.selectedArtifactData.assetSupportFiles;
    if (this.assetFiles != null && this.assetFiles !== undefined && this.assetFiles.length > 0) {
      for (let loop = 0, ilen = this.assetFiles.length; loop < ilen; loop++) {
        if (this.assetFiles[loop].isSupportFile === 0) {
          let assetUrl = this.assetFiles[loop].assetSupportFileName;
          assetUrl = assetUrl.replace(/\\/g, '/');
          assetUrl = this.artifactsSandbox.downloadUrl + assetUrl;
          if (assetUrl.indexOf('plist') !== -1) {
            assetUrl = 'itms-services://?action=download-manifest&url=' + assetUrl;
          }
          var newWin = window.open(assetUrl, '_blank');
          if (!newWin || newWin.closed || typeof newWin.closed == 'undefined') {
            this.PopupBlockerDisablePopup = true;
          }
          this.downloadProjectPopup = false;
        }
      }
    } else {
      if (file) {
        file = file.replace(/\\/g, '/');
        let url = this.artifactsSandbox.downloadUrl + file;
        if (url.indexOf('plist') !== -1) {
          url = 'itms-services://?action=download-manifest&url=' + url;
        }
        window.open(url, '_blank');
        this.downloadProjectPopup = false;
      }
    }
    // }
    this.getSelectedArtifactData();
  }

  copyToClipboard(activeCopyURL: boolean): void {
    const projectDeta = {
      'projectID': this.selectedArtifactData.projId,
      'assetStatusId': this.selectedArtifactData.assetStatusId,
      'isPublished': this.selectedArtifactData.ispublished ? this.selectedArtifactData.ispublished : 1
    };
    this.copyArtifactUrl = document.location.href + '/' + this.selectedArtifactData.assetStatusId
      + '/' + (this.selectedArtifactData.ispublished ? this.selectedArtifactData.ispublished : 1);
    this.copyArtifactUrlPopup = activeCopyURL;
  }

  goToNewUpload(): void {
    const isEdit = true;
    sessionStorage.setItem('isEdit', JSON.stringify(isEdit));
    sessionStorage.setItem('PROJECT_ID', JSON.stringify(this.selectedProjectId));
    this.router.navigate(['./artifacts/artifact-upload/']);
  }
}
