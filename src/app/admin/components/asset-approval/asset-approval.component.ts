import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Artifact } from '../../../shared/models';
import { AdminSandbox } from '../../services/admin.sandbox';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { UtilityService } from '../../../shared/utility/utility.service';
import { AppSandbox } from '../../../app.sandbox';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'cs-asset-approval',
  templateUrl: './asset-approval.component.html',
  styleUrls: ['./asset-approval.component.css']
})
export class AssetApprovalComponent implements OnInit {

  constructor(private router: Router, private adminSandbox: AdminSandbox, private globalErrorHandler: GlobalErrorHandler,
    public utilityService: UtilityService, private appSandbox: AppSandbox, 
    private messageService: MessageService) { }
  public assetApprovals: Artifact[] = [];
  public totalRecords: number;
  private assetsClone: Artifact[] = [];
  public isSearchFound = false;
  public emailAddress: string;
  public successMessage = '';
  public errorMessage = '';
  public noRecordFound = '';
  public dataArray = new Array();

  ngOnInit() {
    this.adminSandbox.assetApprovalDetails$.subscribe(data => {
      this.assetApprovals = data;
      this.totalRecords = this.assetApprovals.length;
      this.assetsClone = Object.assign([], this.assetApprovals);
      this.assetApprovals = this.assetApprovals.reverse();
    }, error => this.globalErrorHandler.handleError(error));
    this.assetLangTranslate();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.assetLangTranslate();
    });
  }

  private assetLangTranslate() {
    this.appSandbox.translate.get('Admin.AssetApproval.NoRecordFound').subscribe((res: string) => {
      this.noRecordFound = res;
    });
    this.appSandbox.translate.get('Admin.ErrorMessage').subscribe((res: string) => {
      this.errorMessage = res;
    });
  }
  public searchUser(): void {
    
    if (this.emailAddress) {       
     
      const tempArray = new Array();
      this.assetApprovals = this.assetsClone;

      for (let loop = 0, len = this.assetApprovals.length; loop < len; ++loop) {
        if (this.assetApprovals[loop].ownerName && (this.assetApprovals[loop].ownerName.toUpperCase() === this.emailAddress.toUpperCase()
          || this.assetApprovals[loop].ownerName.toUpperCase().indexOf(this.emailAddress.toUpperCase()) !== -1)) {
          tempArray.push(this.assetApprovals[loop]);
          this.isSearchFound = true;
        } else if (this.assetApprovals[loop].categoryName.toUpperCase() === this.emailAddress.toUpperCase()
          || this.assetApprovals[loop].categoryName.toUpperCase().indexOf(this.emailAddress.toUpperCase()) !== -1) {
          tempArray.push(this.assetApprovals[loop]);

        } else if (this.assetApprovals[loop].subCategoryName.toUpperCase() === this.emailAddress.toUpperCase()
          || this.assetApprovals[loop].subCategoryName.toUpperCase().indexOf(this.emailAddress.toUpperCase()) !== -1) {
          tempArray.push(this.assetApprovals[loop]);

        }
      }
      
      this.assetsClone = Object.assign([], this.assetApprovals);
      
      if (tempArray.length === 0) {
        this.isSearchFound = false;
      }
      if (this.isSearchFound === false) {        
        this.successMessage = this.noRecordFound;
        this.messageService.add({ severity: 'error', summary:  this.errorMessage, detail: this.noRecordFound });
        this.assetApprovals = this.dataArray;
      } else {
        this.assetApprovals = tempArray;
        this.dataArray = tempArray;      
      }
    }
  }
  public ifEnterPressed(event): void {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
      this.searchUser();
    }
  }

  public resetSearch(): void {
    this.emailAddress = null;
    this.assetApprovals = this.assetsClone;
    this.isSearchFound = false;
  }


  public viewProjectDetails(projID: string, userID: number, isPublished: number): void {
    this.router.navigate(['./admin/view-asset-approval/' + projID]);
  }

}
