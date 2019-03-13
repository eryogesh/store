export class LoginForm {
    public email: string;
    //public password: string;

    constructor(loginForm: any) {
        this.email = loginForm.email || '';
        //  this.password = loginForm.password || '';
    }
}

export class Message {
    severity: string;
    summary: string;
    detail: string;

}


export class RegistrationForm {
    public email: string;
    public password: string;
    public designation: string;
    public username: string;
    public fullname: string;

    constructor(registrationForm: any) {
        this.email = registrationForm.email || '';
        this.password = registrationForm.password || '';
        this.designation = registrationForm.designation || '';
        this.username = registrationForm.username || '';
        this.fullname = registrationForm.fullname || '';
    }
}

export class RegResponse {
    msg: string;
    status: string;

    constructor(regResponse: any) {
        this.msg = regResponse.msg || '';
        this.status = regResponse.status || '';

    }
}

export class UserSessionModel {
    public msg: string;
    public session_auth_key: string;
    public userValid: boolean;
    public userId: number;
    public uniqueId: string;

    constructor(userInfo: any) {
        this.msg = userInfo.msg || '';
        this.session_auth_key = userInfo.session_auth_key || '';
        this.userValid = userInfo.userValid || '';
        this.userId = userInfo.userId || '';
        this.uniqueId = userInfo.uniqueId || '';

    }
}

export class UserAccess {
    profileId: string;
    userRole: string;
    roleId: string;
    userProfile: string;
    userId: string;
    constructor(userAccess: any) {
        this.profileId = userAccess.profileId || '';
        this.userRole = userAccess.userRole || '';
        this.roleId = userAccess.roleId || '';
    }
}

export class UserDetails {
    shortID: string;
    lastLogin: string;
    emailID: string;
    profileImage: string;
    isActive: string;
    categoryPrefs: any;
    userID: number;
    userAccess: UserAccess;
    name: string;
    isApproved: number;
    designation: string;
    constructor() {
    }
}

export class UserData {
    user: UserDetails;

    constructor() { }
}

export class UserDetailsResponse {
    user: {
        shortID: string,
        lastLogin: string,
        emailID: string,
        profileImage: string,
        isActive: string,
        categoryPrefs: string,
        userID: number,
        userAccess: UserAccess,
        name: string,
        designation: string,
        isApproved: number,
        userProfileName: string,
        userRoleName: string
      };
}
