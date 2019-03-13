import { UserAccess } from '..';

export class UserApprovals {
    lastLogin: string;
    emailID: string;
    userID: string;
    password: string;
    name: string;
    designation: string;
    userProfileName: string;
    userRoleName: string;
    userAccess: UserAccess;
    constructor(userAccessInfo?: UserApprovals) {
        this.lastLogin = userAccessInfo ? userAccessInfo.lastLogin : '';
        this.emailID = userAccessInfo ? userAccessInfo.emailID : '';
        this.userID = userAccessInfo ? userAccessInfo.userID : '';
        this.password = userAccessInfo ? userAccessInfo.password : '';
        this.name = userAccessInfo ? userAccessInfo.name : '';
        this.designation = userAccessInfo ? userAccessInfo.designation : '';
        this.userProfileName = userAccessInfo ? userAccessInfo.userProfileName : '';
        this.userRoleName = userAccessInfo ? userAccessInfo.userRoleName : '';
        this.userAccess = userAccessInfo ? userAccessInfo.userAccess : null;
    }
}
