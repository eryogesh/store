export class UserProfiles {

    profileName: string;
    profileId: string;

    constructor(UserProfilesInfo?: UserProfiles) {
        this.profileName = UserProfilesInfo ? UserProfilesInfo.profileName : '';
        this.profileId = UserProfilesInfo ? UserProfilesInfo.profileId : '';
    }
}
