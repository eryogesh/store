export class UserApproveResponse {
    categoryPrefs: any = [];
    designation: string;
    emailID: string;
    isActive: string;
    isApproved: string;
    lastLogin: string;
    name: string
    password: '';
    shortID: '';
    userAccess: {};
    userID: string;
    userProfileName: '';
    userRoleName: '';


    constructor(userApproveResInfo: UserApproveResponse) {
        this.categoryPrefs = userApproveResInfo ? userApproveResInfo.categoryPrefs : '';
        this.designation = userApproveResInfo ? userApproveResInfo.designation : '';
        this.emailID = userApproveResInfo ? userApproveResInfo.emailID : '';
        this.isActive = userApproveResInfo ? userApproveResInfo.isActive : '';
        this.isApproved = userApproveResInfo ? userApproveResInfo.isApproved : '';
        this.lastLogin = userApproveResInfo ? userApproveResInfo.lastLogin : '';
        this.name = userApproveResInfo ? userApproveResInfo.name : '';
        this.password = userApproveResInfo ? userApproveResInfo.password : '';
        this.shortID = userApproveResInfo ? userApproveResInfo.shortID : '';
        this.userAccess = userApproveResInfo ? userApproveResInfo.userAccess : '';
        this.userID = userApproveResInfo ? userApproveResInfo.userID : '';
        this.userProfileName = userApproveResInfo ? userApproveResInfo.userProfileName : '';
        this.userRoleName = userApproveResInfo ? userApproveResInfo.userRoleName : '';
    }
}