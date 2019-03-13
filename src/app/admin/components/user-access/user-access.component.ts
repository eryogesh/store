import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';

import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { UserApprovals } from '../../../shared/models/admin/user-approvals.modal';
import { UserProfiles } from '../../../shared/models/admin/user-profiles.modal';
import { UserRole } from '../../../shared/models/admin/user-roles.modal';
import { AdminSandbox } from '../../services/admin.sandbox';
import { AppSandbox } from '../../../app.sandbox';

@Component({
  selector: 'cs-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {


  constructor(private router: Router, private adminSandbox: AdminSandbox, private globalErrorHandler: GlobalErrorHandler,
    private messageService: MessageService, private appSandbox: AppSandbox) {
  }
  public usersToApprove: UserApprovals[];
  public userRoles: UserRole[] = [];
  public userProfiles: UserProfiles[] = [];
  public showErrorMsg = [];
  public errorMsg: string;
  public isCancelable = false;
  public showUserLimit: 4;
  public totalRecords: number;
  public emailAddress: string;
  public userRole: string;
  public userProfile: string;
  public profileId: string;
  public undefinedRoleDeveloper = '';
  public roleAndProfileErrorMsg = '';
  public successMessage = '';
  public errorMessage = '';

  ngOnInit() {
    this.isCancelable = false;
    this.adminSandbox.UserAccessApproval$.subscribe((data: UserApprovals[]) => {
      this.usersToApprove = data;
      this.totalRecords = this.usersToApprove.length;
    }, error => this.globalErrorHandler.handleError(error)
    );
    this.adminSandbox.UserRole$.subscribe(data => {
      this.userRoles = data;
    }, error => this.globalErrorHandler.handleError(error)
    );
    this.adminSandbox.UserProfiles$.subscribe(data => {
      this.userProfiles = data;
    }, error => this.globalErrorHandler.handleError(error)
    );
    this.userAccessLang();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.userAccessLang();
    });
  }

  private userAccessLang() {
    this.appSandbox.translate.get('Admin.UserAccess.undefinedRoleDeveloper').subscribe((res: string) => {
      this.undefinedRoleDeveloper = res;
    });
    this.appSandbox.translate.get('Admin.UserAccess.roleAndProfileErrorMsg').subscribe((res: string) => {
      this.roleAndProfileErrorMsg = res;
    });
    this.appSandbox.translate.get('Admin.Success').subscribe((res: string) => {
      this.successMessage = res;
    });
    this.appSandbox.translate.get('Admin.ErrorMessage').subscribe((res: string) => {
      this.errorMessage = res;
    });

  }
  public usersToApproveAccess(): any {
    if (!this.emailAddress) {
      this.emailAddress = '';
      return false;
    }
    const dataReq = {
      searchEmail: this.emailAddress
    };
    this.adminSandbox.getEmailUserAccessData(dataReq);
    this.adminSandbox.UserAccessSearchResponse$.subscribe((data: any) => {
      this.errorMsg = '';
      if (data && data.msg !== undefined) {
        this.messageService.add({ severity: 'error', summary: this.errorMessage, detail: data.msg });
      } else {
        this.usersToApprove = data;
        this.isCancelable = true;
        this.usersToApprove = this.usersToApprove.reverse();
      }
    }, error => this.globalErrorHandler.handleError(error)
    );
  }

  public changeUserRole(userRole: string, userID: string): void {
    this.showErrorMsg = [];
    this.errorMsg = '';
    this.userRole = userRole;
    if (this.userProfile === 'AP') {
      if (this.userRole === 'DP') {
        this.showErrorMsg[userID] = true;
        this.errorMsg = this.undefinedRoleDeveloper;
      }
    }
  }

  public changeUserProfile(userProfile: string): void {
    this.showErrorMsg = [];
    this.errorMsg = '';
    this.userProfile = userProfile;
  }

  public approveUser(aprvID: string, index: number, userRole: string, profileId: string): void {
    this.userRole = userRole;
    this.profileId = profileId;
    if (this.profileId === 'AP') {
      if (this.userRole === 'DP') {
        this.showErrorMsg[aprvID] = true;
        this.errorMsg = this.undefinedRoleDeveloper;
        return;
      }
    }

    const dataReq = {
      approveeId: aprvID, userRole: this.usersToApprove[index].userAccess.roleId,
      userProfile: this.usersToApprove[index].userAccess.profileId
    };
    this.adminSandbox.approveUser(dataReq)
      .subscribe(data => {
        if (data && data.status !== undefined) {
          this.messageService.add({ severity: 'success', summary: this.successMessage, detail: this.roleAndProfileErrorMsg });
          this.ngOnInit();
        } else {
          this.showErrorMsg[aprvID] = true;
        }
      }, error => this.globalErrorHandler.handleError(error));
  }

  public resetSearch(): void {
    this.ngOnInit();
  }
  public ifEnterPressed(event): void {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13) {
      this.usersToApproveAccess();
    }
  }
}
