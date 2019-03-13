export class UserAccessApproval {
    lastLogin: string;
    emailID: string;
    userID: string;
    password: string;
    name: string;
    designation: string;
    userProfileName: string;
    userRoleName: string;

    constructor(userAccessInfo?: UserAccessApproval) {
        this.lastLogin = userAccessInfo ? userAccessInfo.lastLogin : '';
        this.emailID = userAccessInfo ? userAccessInfo.emailID : '';
        this.userID = userAccessInfo ? userAccessInfo.userID : '';
        this.password = userAccessInfo ? userAccessInfo.password : '';
        this.name = userAccessInfo ? userAccessInfo.name : '';
        this.designation = userAccessInfo ? userAccessInfo.designation : '';
        this.userProfileName = userAccessInfo ? userAccessInfo.userProfileName : '';
        this.userRoleName = userAccessInfo ? userAccessInfo.userRoleName : '';
    }
}
