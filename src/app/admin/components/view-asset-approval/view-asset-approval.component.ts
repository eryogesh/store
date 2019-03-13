import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Artifact } from '../../../shared/models';
import { UserProfiles } from '../../../shared/models/admin/user-profiles.modal';
import { AdminSandbox } from '../../services/admin.sandbox';
import { PostResponse } from '../../../shared/models/post-response.model';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { UtilityService } from '../../../shared/utility';
import { MessageService } from 'primeng/components/common/messageservice';
import { AppSandbox } from '../../../app.sandbox';
import { YammerService } from '../../../yammer/yammer.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'cs-view-asset-approval',
  templateUrl: './view-asset-approval.component.html',
  styleUrls: ['./view-asset-approval.component.css']
})
export class ViewAssetApprovalComponent implements OnInit {

  constructor(private router: Router,
    public adminSandbox: AdminSandbox,
    private activateRoute: ActivatedRoute, private globalErrorHandler: GlobalErrorHandler,
    public utilityService: UtilityService, private messageService: MessageService,
    private appSandbox: AppSandbox, private yammer: YammerService) {
    this.activateRoute.params.subscribe(params => {
      this.selectedProjectId = params.id;
    }, error => this.globalErrorHandler.handleError(error));
  }
  public msgFlag: boolean;
  public profiles: UserProfiles[] = [];
  public rejectAssetDialog = false;
  public displayAproveAsset = false;
  public projectDataSize: string;
  public selectedProjectId: number;
  public selectedArtifactData: any = {};
  public description: string;
  public features: string;
  public tags: string;
  public fileType: string;
  public isFavorite: number;
  public supportingFile = [];
  public isSupportFiles = false;
  private assetFiles = [];
  private isZipContent = false;
  private zipContent: any = [];
  public projectArray: any = [];
  private isNewVersion: string;
  private hideNewVersionTemplate = true;
  public projectId: number;
  public checkedSubCategory: any = [];
  public assetApprovals: Artifact[] = [];
  public totalRecords: number;
  private assetsClone: Artifact[] = [];
  public errorMsgProfile = '';
  public comment: string;
  public pfMapping: string;
  public pfArray: string[];
  public deleteAsset: PostResponse;
  public userDetails: string;
  private checkedEle: string;
  public errormsg: any;
  public checkboxFlag: boolean;
  public pleaseSelectProfile = '';
  public successMessage = '';

  ngOnInit() {
    this.viewAssetlang();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.viewAssetlang();
    });

    this.adminSandbox.UserProfiles$.subscribe(response => {
      this.profiles = response;
    }, error => this.globalErrorHandler.handleError(error));
    this.getSelectedArtifactData();
  }

  private viewAssetlang() {

    this.appSandbox.translate.get('Admin.ViewAssetApproval.PleaseSelectProfile').subscribe((res: string) => {
      this.pleaseSelectProfile = res;
    });
    this.appSandbox.translate.get('Admin.Success').subscribe((res: string) => {
      this.successMessage = res;
    });
  }
  public openmodalReject(): void {
    this.rejectAssetDialog = true;
    this.displayAproveAsset = false;
    this.comment = '';
  }

  public cancel(): void {
    this.rejectAssetDialog = false;
    this.displayAproveAsset = false;
  }

  public openModalApprove(): void {
    this.comment = '';
    for (let i = 0; i < this.profiles.length; i++) {
      if ($('#' + this.profiles[i].profileId).is(':checked')) {
        this.errorMsgProfile = '';
        this.msgFlag = true;
        this.displayAproveAsset = true;
        this.rejectAssetDialog = false;
      } else {
        this.errorMsgProfile = this.pleaseSelectProfile;
      }
    }
    if (this.msgFlag === true) {
      this.errorMsgProfile = '';
      this.msgFlag = false;
    }
    this.adminSandbox.assetApprovalDetails$.subscribe(data => {
      this.assetApprovals = data;
      this.totalRecords = this.assetApprovals.length;
      this.assetsClone = Object.assign([], this.assetApprovals);
      this.assetApprovals = this.assetApprovals.reverse();
    }, error => this.globalErrorHandler.handleError(error));
  }

  public getSelectedArtifactData(): void {
    this.adminSandbox.getAssetDetails(this.selectedProjectId);
    this.adminSandbox.viewAssetDetails$.subscribe(data => {
      if (data.assetList.length > 0) {
        this.projectArray = data.assetList;

        // this code check the re-direction from list page or version page
        this.isNewVersion = sessionStorage.getItem('isNewVersion');
        if (this.isNewVersion === 'true') {
          this.hideNewVersionTemplate = false;
          this.isNewVersion = 'false';
          sessionStorage.setItem('isNewVersion', this.isNewVersion);
          this.selectedArtifactData = this.projectArray[0];

        } else {
          this.hideNewVersionTemplate = true;
          const len = this.projectArray.length - 1;
          this.selectedArtifactData = data.assetList[len];
        }

        this.description = decodeURIComponent(this.selectedArtifactData.description);
        this.features = decodeURIComponent(this.selectedArtifactData.features);
        this.tags = this.selectedArtifactData.tags;
        this.tags = this.tags.split(/[ ,]+/).join(', ');
        this.isFavorite = this.selectedArtifactData.isFavorite;
        this.projectId = this.selectedArtifactData.categoryId;
        this.assetFiles = this.selectedArtifactData.assetSupportFiles;
        if (this.assetFiles) {
          for (let loop = 0; loop < this.assetFiles.length; loop++) {
            if (this.assetFiles[loop].isSupportFile === 1) {
              this.isSupportFiles = true;
              let assetUrl = this.assetFiles[loop].assetSupportFileName;
              assetUrl = assetUrl.replace(/\\/g, '/');
              assetUrl = this.adminSandbox.downloadUrl + assetUrl;
              this.assetFiles[loop].assetSupportFileName = assetUrl;
              this.supportingFile.push(this.assetFiles[loop]);
            } else {
              const zip = this.selectedArtifactData.assetSupportFiles[0].zipContents;
              if (zip.length > 0) {
                const zipContent = zip;
                this.zipContent = JSON.parse(zipContent);
                this.isZipContent = true;
              }
            }
          }
        }
        this.pfMapping = this.selectedArtifactData.profileMapping;
        if (this.pfMapping) {
          if (this.pfMapping.indexOf(',') !== -1) {
            this.pfArray = this.pfMapping.split(',');
            for (let i = 0; i < this.pfArray.length; i++) {
              if (this.pfArray[i] === 'DY') {
                $('#DY').prop('checked', true);
              } else if (this.pfArray[i] === 'SL') {
                $('#SL').prop('checked', true);
              }
            }
          } else {
            if (this.pfMapping === 'DY') {
              $('#DY').prop('checked', true);
            } else if (this.pfMapping === 'SL') {
              $('#SL').prop('checked', true);
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
        this.projectDataSize = prjSize.toString();
        // If it's not already a String

        const ownerImgUrl = this.selectedArtifactData.ownerImage;
        if (ownerImgUrl) {
          this.selectedArtifactData.ownerImage = this.adminSandbox.downloadUrl + ownerImgUrl.replace(/\\/g, '/');
        }
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  public downloadArtifact(): void {
    let url = null;
    let file = this.selectedArtifactData.projectPath;
    this.assetFiles = this.selectedArtifactData.assetSupportFiles;
    if (this.assetFiles && (this.assetFiles.length > 0)) {
      for (let loop = 0; loop < this.assetFiles.length; loop++) {
        if (this.assetFiles[loop].isSupportFile === 0) {
          let assetUrl = this.assetFiles[loop].assetSupportFileName;
          assetUrl = assetUrl.replace(/\\/g, '/');
          assetUrl = this.adminSandbox.downloadUrl + assetUrl;
          if (assetUrl.indexOf('plist') !== -1) {
            assetUrl = 'itms-services://?action=download-manifest&url=' + assetUrl;
          }
          window.open(assetUrl, '_blank');
        }
      }
    } else {
      if (file) {
        file = file.replace(/\\/g, '/');
        url = this.adminSandbox.downloadUrl + file;
        if (url.indexOf('plist') !== -1) {
          url = 'itms-services://?action=download-manifest&url=' + url;
        }
        window.open(url, '_blank');
      }
    }
  }

  public rejectProject(status: string, comment: any, checkedFlag: boolean): any {
    if (checkedFlag === true) {
      const data = { assetId: this.selectedProjectId };
      this.adminSandbox.DeleteAsset(data);
      this.adminSandbox.deleteAsset$.subscribe(res => {
        this.deleteAsset = res;
      }, error => this.globalErrorHandler.handleError(error)
      );
    }
    this.userDetails = sessionStorage.getItem('USER_DETAILS');
    if (!this.comment) {
      return false;
    }

    for (let i = 0; i < this.profiles.length; i++) {
      if ($('#' + this.profiles[i].profileId).is(':checked')) {
        this.checkedEle = this.profiles[i].profileId;
        this.checkedSubCategory.push(this.checkedEle);
      }
    }
    const dataReq = {
      projectId: this.selectedProjectId, reviewerRemarks: comment,
      statusId: status, profileMapping: this.checkedSubCategory, catId: this.projectId
    };
    this.adminSandbox.saveApprovedAssets(dataReq).subscribe(res => {
      if (res && res.status === true) {
        this.messageService.add({ severity: 'success', summary: this.successMessage, detail: res.msg });
        this.displayAproveAsset = false;

        const msg = this.selectedArtifactData.ownerName + '(' + this.selectedArtifactData.ownerEmailID +
          ') just uploaded a new artifact - ' + this.selectedArtifactData.projectName
          + ' under ' + this.selectedArtifactData.categoryName + '-' + this.selectedArtifactData.subCategoryName + ' category.';
        this.yammer.postMessage(msg);

        setTimeout(() => {
          this.router.navigate(['./admin/asset-approval']);
        }, 3000);
      } else {
        this.messageService.add({ severity: 'success', summary: this.successMessage, detail: res.msg });
        this.rejectAssetDialog = false;
        setTimeout(() => {
          this.router.navigate(['./admin/asset-approval']);
        }, 3000);
      }
    }, error => this.globalErrorHandler.handleError(error));
  }
  public cancelRejectPopup(status: string): void {
    this.rejectAssetDialog = false;
    this.comment = '';
  }

  public cancelAprovalPopup(status: string): void {
    this.displayAproveAsset = false;
  }
}
