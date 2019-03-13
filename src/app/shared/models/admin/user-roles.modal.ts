export class UserRole {

    roleId: string;
    roleName: string;

    constructor(userRolesInfo: UserRole) {
        this.roleId = userRolesInfo ? userRolesInfo.roleId : '';
        this.roleName = userRolesInfo ? userRolesInfo.roleName : '';
    }
}