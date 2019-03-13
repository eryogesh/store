import { UserAccess } from '..';
import { PostResponse } from '../post-response.model';

export class UserAccessSearchEmailResponse {
    categoryPrefs: any = [];
    designation: string;
    emailID: string;
    isActive: string;
    isApproved: string;
    lastLogin: string;
    name: string;
    password: string;
    shortID: string;
    userAccess: UserAccess;
    userID: string;
    userProfileName: string;
    userRoleName: string;
    msg: String;

    constructor(userApproveResInfo: UserAccessSearchEmailResponse) {
        this.categoryPrefs = userApproveResInfo ? userApproveResInfo.categoryPrefs : '';
        this.designation = userApproveResInfo ? userApproveResInfo.designation : '';
        this.emailID = userApproveResInfo ? userApproveResInfo.emailID : '';
        this.isActive = userApproveResInfo ? userApproveResInfo.isActive : '';
        this.isApproved = userApproveResInfo ? userApproveResInfo.isApproved : '';
        this.lastLogin = userApproveResInfo ? userApproveResInfo.lastLogin : '';
        this.name = userApproveResInfo ? userApproveResInfo.name : '';
        this.password = userApproveResInfo ? userApproveResInfo.password : '';
        this.shortID = userApproveResInfo ? userApproveResInfo.shortID : '';
        this.userAccess = userApproveResInfo ? userApproveResInfo.userAccess : null;
        this.userID = userApproveResInfo ? userApproveResInfo.userID : '';
        this.userProfileName = userApproveResInfo ? userApproveResInfo.userProfileName : '';
        this.userRoleName = userApproveResInfo ? userApproveResInfo.userRoleName : '';
        this.msg = userApproveResInfo ? userApproveResInfo.msg : null;
    }
}
