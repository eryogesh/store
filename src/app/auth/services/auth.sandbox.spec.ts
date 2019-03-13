import { TestBed, inject } from '@angular/core/testing';

import { AuthSandbox, AuthApiClientService } from '.';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../../app-config.service';
import { HttpResponseHandlerService } from '../../shared/async-services/http';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService, TranslateLoader, TranslateParser, TranslateModule } from 'ng2-translate';
import { NotificationsService } from 'angular2-notifications';
import { UtilityService } from '../../shared/utility';
import { LoginForm, RegistrationForm, RegResponse, UserSessionModel, UserAccess } from '../../shared/models';
import { Observable } from 'rxjs/Observable';
class MockConfigService {
    get(key: any) {
        return key;
    }
}
@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
    transform(value: number): number {
        return value;
    }
}
const artifact = {
    subCategoryName: '',
    projId: 12,
    approverRemarks: '',
    projectType: '',
    description: '',
    isActive: 12,
    versionName: '',
    categoryName: '',
    userID: 12,
    features: '',
    userDownloaded: 11,
    ownerName: '',
    ownerEmailID: '',
    imageUrl: '',
    versionNo: 11,
    avgRating: 11,
    viewCount: 1,
    assetStatusId: '',
    profileMapping: '',
    isPublished: 2,
    projectLastUpdate: '',
    projectPath: '',
    isReviewed: 1,
    subCategoryId: 1,
    tags: '',
    effortsInvested: 1,
    size: 1,
    projectName: '',
    categoryId: 1,
    downloadCount: 1,
    isFavorite: 1,
    uploadType: '',
    assetSupportFiles: Object,
};
const userAccess: UserAccess = {
    profileId: 'SL',
    userRole: 'SUPER_ADMIN',
    roleId: 'SA',
    userProfile: 'SALES',
    userId: '',
  };
const userDetails = {
    shortID: '',
    lastLogin: '',
    emailID: '',
    profileImage: '',
    isActive: '',
    categoryPrefs: '',
    userID: 12,
    userAccess: userAccess,
    name: '',
    isApproved: 12,
    designation: '',

};
const postResponse = {
    msg: '',
    status: true,
};
const data = {
    userId: 12,
    session_auth_key: '',
    uniqueId: ''
};
class MocknavigateToPreviousLocation {
    navigateToPreviousLocation() {

    }
}
fdescribe('AuthSandbox', () => {
    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    const sessionModel = {
        'msg': 'User Credentials are Valid',
        'session_auth_key': 'eeaa4oaa3ueckvlpfofe004aoh',
        'userValid': true,
        'userId': 166
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MockPipe],
            providers: [AuthSandbox, AuthApiClientService, HttpClient, HttpHandler, { provide: ConfigService, useClass: MockConfigService }
                , HttpResponseHandlerService, { provide: Router, useValue: mockRouter }, TranslateModule,
                TranslateService,
                TranslateLoader,
                TranslateParser, NotificationsService, UtilityService]
        });
    });

    it('should be created', inject([AuthSandbox], (service: AuthSandbox) => {
        expect(service).toBeTruthy();
    }));
    it('loginUser should be called', inject([AuthSandbox, AuthApiClientService], (sandbox: AuthSandbox, service: AuthApiClientService) => {
        const loginForm: LoginForm = { 'email': 'Kanchan.kanchan@capgemini.com' };
        const uuid = '234235';
        const userDetail = spyOn(service, 'checkSSO').and.returnValue(sessionModel);
        sandbox.loginUser(loginForm, uuid);
    }));
    it('doLogout should be called', inject([AuthSandbox, AuthApiClientService], (sandbox: AuthSandbox, service: AuthApiClientService) => {
        spyOn(service, 'doLogout').and.returnValue(sessionModel);
        sandbox.doLogout(data);
    }));
    it('registerUser should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const registrationForm: RegistrationForm = {
                email: 'yogesh.patel@capgemini.com',
                password: '12345',
                designation: '',
                username: '',
                fullname: '',
            };
            const regResponse: RegResponse = {
                msg: '',
                status: '',
            };
            spyOn(service, 'registration').and.returnValue(regResponse);
            sandbox.registerUser(registrationForm);
        }));
    it('forgotPassword should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const userId =
                'yogesh.patel@capgemini.com'
                ;
            const regResponse: RegResponse = {
                msg: '',
                status: '',
            };
            spyOn(service, 'forgotPassword').and.returnValue(regResponse);
            sandbox.forgotPassword(userId);
        }));
    it('resetPassword should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const userId =
                'yogesh.patel@capgemini.com'
                ;
            const regResponse: RegResponse = {
                msg: '',
                status: '',
            };
            spyOn(service, 'resetPassword').and.returnValue(regResponse);
            sandbox.resetPassword(userId);
        }));
    it('getUser should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const userId =
                'yogesh.patel@capgemini.com'
                ;
            const regResponse: RegResponse = {
                msg: '',
                status: '',
            };
            const userSessionModel = {
                msg: '',
                session_auth_key: '',
                userValid: true,
                userId: 12,
                uniqueId: '',
            };
            spyOn(service, 'getUser').and.returnValue(userDetails);
            sandbox.getUser(userSessionModel);
        }));
    it('userUploadArtifacts should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            spyOn(service, 'getUserUploadArtifacts').and.returnValue(artifact);
            sandbox.userUploadArtifacts();
        }));
    it('userDownloadArtifacts should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            spyOn(service, 'getUserDownloadArtifacts').and.returnValue(artifact);
            sandbox.userDownloadArtifacts();
        }));
    it('uploadUserProfileImage should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const uploadUserImageResponse = {
                filePath: '',
                msg: '',
                status: true,
            };
            const fileData = { file: '', size: 20 };
            spyOn(service, 'uploadUserProfileImage').and.returnValue(uploadUserImageResponse);
            sandbox.uploadUserProfileImage(fileData);
        }));
    it('editUserData should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const userData = {
                username: 'yogesh.patel@capgemini.com',
                designation: 'Senior manager',
                userId: 11,
            };
            spyOn(service, 'editUserProfile').and.returnValue(postResponse);
            sandbox.editUserData(userData);
        }));
    it('showAllCategories should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const category = {
                categoryName: '',
                catID: 11,
                catParentId: 1,
                isActive: 2,
                isChecked: true,
                checked: true,
            };
            spyOn(service, 'showAllCategories').and.returnValue(category);
            sandbox.showAllCategories();
        }));
    it('getLoggedUserData should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const userData = {
                user: userDetails,
            };
            spyOn(service, 'getUserDetails').and.returnValue(userData);
            sandbox.getLoggedUserData();
        }));
    it('updateUserCategoriesPrefs should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const categoryData = { categoryPrefs: 'Insurance' };
            spyOn(service, 'updateUserCategoriesPrefs').and.returnValue(postResponse);
            sandbox.updateUserCategoriesPrefs(categoryData);
        }));
    it('userFavouriteArtifacts should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            spyOn(service, 'getFavouriteArtifacts').and.returnValue(artifact);
            sandbox.userFavouriteArtifacts();
        }));
    it('loadUserArtifacts should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            spyOn(service, 'getFavouriteArtifacts').and.returnValue(artifact);
            sandbox.loadUserArtifacts();
        }));
    it('getUserDetailsHeader should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const uuid = '234235';
            spyOn(service, 'getUserDetailsHeader').and.returnValue(sessionModel);
            sandbox.getUserDetailsHeader(uuid);
        }));
    it('getUserDetailsHeader should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const uuid = '234235';
            spyOn(service, 'getUserDetailsHeader').and.returnValue(sessionModel);
            sandbox.getUserDetailsHeader(uuid);
        }));
    it('generateUUID should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const d = new Date().getTime();
            const uuid = 'uuid';
            sandbox.generateUUID();
        }));
    it('loadUserArtifacts should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const downloadUrl = service.downloadUrl;
            sandbox.loadUserArtifacts();
        }));
    it('getUserDetails should be called', inject([AuthSandbox, AuthApiClientService],
        (sandbox: AuthSandbox, service: AuthApiClientService) => {
            const userData = { userId: '', session_auth_key: '', uniqueId: '' };
            const userSessionModel = new UserSessionModel(userData);
            spyOn(sandbox, 'getUser').and.returnValue(userSessionModel);
                            const userDetailsData = {
                                user: {
                                shortID: '',
                                lastLogin: '2018-02-22 18:26:12.0',
                                emailID: 'yogesh.patel@capgemini.com',
                                profileImage: '\\CapStore\\ProfilePics\\166\\Desert.jpg',
                                isActive: 'T',
                                categoryPrefs: '[{\"catID\":46,\"listSubCategories\":[]},{\"catID\":47,\"listSubCategories\":[]}]',
                                userID: 166,
                                userAccess: userAccess,
                                name:  'Yogesh Patel',
                                isApproved: 0,
                                designation: 'Sr Manager',
                                userProfileName: '',
                                userRoleName: ''
                                }
                              };
            sandbox.userSessionDetail$ = Observable.of(userDetailsData);
            sandbox.getUserDetails(userData.userId, userData.session_auth_key, userData.uniqueId);
        }));
});
