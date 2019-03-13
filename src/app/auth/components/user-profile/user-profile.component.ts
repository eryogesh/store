import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectItem } from 'primeng/primeng';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { Artifact, Category, PostResponse, UploadUserImageResponse, UserData, UserDetails } from '../../../shared/models';
import { UtilityService } from '../../../shared/utility';
import { AuthSandbox } from '../../services/auth.sandbox';
import { Observable } from 'rxjs/Observable';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { AppSandbox } from '../../../app.sandbox';
declare var yam: any;
@Component({
  selector: 'cs-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  copyArtifactUrlPopup: boolean;
  copyArtifactUrl: string;
  form;
  values: any;
  ngForm: FormGroup;
  userform: FormGroup;
  submitted: boolean;
  description: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    public authSandbox: AuthSandbox,
    private messageService: MessageService,
    private globalErrorHandler: GlobalErrorHandler,
    public utilityService: UtilityService,
    private ng2ImgToolsService: Ng2ImgToolsService, private appSandbox: AppSandbox
  ) {
    this.userform = this.fb.group({
      username: new FormControl(
        '',
        Validators.compose([this.userNameValidation('username')])
      ),
      designation: new FormControl(
        '',
        Validators.compose([this.userNameValidation('designation')])
      )
    });
  }
  public assets: SelectItem[] = [];
  public selectedAsset: string;
  public display = false;
  public userDetails = new UserDetails();
  public username: string;
  public profileImage: string;
  public rolId: string;
  public editProfilePopup = false;
  public categoryPopup = false;
  public allCategories: Category[];
  public catPrefs = [];
  private allCategoriesLength: number;
  public selectedCategories: string[];
  public errormsgUpdate: string;
  public msgs: Message[] = [];
  public totalRecords: number;
  public artifactData: Artifact[];
  public displayMessage = '';
  public displayArtifactStatus = true;
  private session = JSON.parse(sessionStorage.getItem('sessionData'));
  private allProjects = [];
  private uploadedImageType: string;
  public uploadsLabel = '';
  public downloadsLabel = '';
  public favouritesLabel = '';
  public noRecordFoundMsg = '';
  public successMsg = '';
  public errorMessage = '';
  public pleaseUploadValidImageValue = '';
  public selectAtleastOneMainCategoryValue = '';
  public dataLoadedMsg = '';
  public dataLoadedbetweenMsg = '';
  public dataLoadedAndMsg = '';

  ngOnInit() {
    if (this.assets && this.assets.length <= 0) {
      this.userProflang();
    }
    this.appSandbox.translate.onLangChange.subscribe(() => {
      if (this.assets.length > 0) {
        this.userProflang();
      }
   });

    this.authSandbox.getLoggedUserData();
    this.authSandbox.getLoggedUser$.subscribe(
      (response: UserData) => {
        if (response) {
          this.userDetails = response.user;
          this.userDetails.profileImage =
            this.authSandbox.downloadUrl + '' + this.userDetails.profileImage.replace(/\\/g, '/');
          this.userDetails.designation = response.user.designation;
          this.userDetails.name = response.user.name;
          this.userDetails.emailID = response.user.emailID;
          this.userDetails.userAccess.profileId = response.user.userAccess.profileId;
          this.userDetails.userAccess.userRole = response.user.userAccess.userRole;
          this.userDetails.userAccess.roleId = response.user.userAccess.roleId;
          if ((response.user.categoryPrefs) && (response.user.categoryPrefs.length > 0)) {
            this.userDetails.categoryPrefs = JSON.parse(response.user.categoryPrefs);
          }
          this.username = this.userDetails.name;
          this.profileImage = this.userDetails.profileImage;
          this.rolId = this.userDetails.userAccess.roleId;
          this.utilityService.userName$ = Observable.of(this.userDetails.name.substring(0, 10) + '..');
          this.utilityService.titleName$ = Observable.of(this.userDetails.name);
          this.utilityService.designation$ = Observable.of(this.userDetails.designation.substring(0, 40) + '..');
          this.utilityService.tileDesignation$ = Observable.of(this.userDetails.designation);
          sessionStorage.setItem('USER_DETAILS', JSON.stringify(this.userDetails));
        }
      },
      error => this.globalErrorHandler.handleError(error)
    );
    this.authSandbox.userFavouriteArtifacts();
    this.authSandbox.userDownloadArtifacts();
    this.authSandbox.userUploadArtifacts();
  }

  private userProflang() {
    this.assets = [];
    this.appSandbox.translate.get('Profile.Uploads').subscribe((res: string) => {
      this.uploadsLabel = res;
      this.assets.push({ label: this.uploadsLabel, value: this.uploadsLabel });
      this.selectedAsset = this.uploadsLabel;
    });
    this.appSandbox.translate.get('Profile.Downloads').subscribe((res: string) => {
      this.downloadsLabel = res;
      this.assets.push({ label: this.downloadsLabel, value: this.downloadsLabel });
    });
    this.appSandbox.translate.get('Profile.Favourites').subscribe((res: string) => {
      this.favouritesLabel = res;
      this.assets.push({ label: this.favouritesLabel, value: this.favouritesLabel });
    });
    this.appSandbox.translate.get('Profile.NoRecordFound').subscribe((res: string) => {
      this.noRecordFoundMsg = res;
    });
    this.appSandbox.translate.get('Profile.SuccessMsg').subscribe((res: string) => {
      this.successMsg = res;
    });
    this.appSandbox.translate.get('Profile.ErrorMessage').subscribe((res: string) => {
      this.errorMessage = res;
    });
    this.appSandbox.translate.get('Profile.PleaseUploadValidImage').subscribe((res: string) => {
      this.pleaseUploadValidImageValue = res;
    });
    this.appSandbox.translate.get('Profile.PleaseSelectAtleastOneMainCategory').subscribe((res: string) => {
      this.selectAtleastOneMainCategoryValue = res;
    });

    this.appSandbox.translate.get('Profile.DataLoaded').subscribe((res: string) => {
    this.dataLoadedMsg = res;
    });
    this.appSandbox.translate.get('Profile.Between').subscribe((res: string) => {
    this.dataLoadedbetweenMsg = res;
    });
    this.appSandbox.translate.get('Profile.And').subscribe((res: string) => {
    this.dataLoadedAndMsg = res;
    });
  }
  userNameValidation(control) {
    // tslint:disable-next-line:no-shadowed-variable
    return control => {
      const regex = /^[a-zA-Z\s]*$/;
      return regex.test(control.value) ? null : { invalidFNameandDesig: true };
    };
  }
  loadData(event) {
    if (!this.artifactData) {
      this.authSandbox.userUploadArtifacts();
      this.authSandbox.userUploadArtifacts$.subscribe((data: Artifact[]) => {
        this.totalRecords = data.length;
        const newDataArray = [];
        const dataCount = data.length > event.rows ? event.rows : data.length;
        if (data && data.length) {
          this.allProjects = data;
          this.displayMessage = '';
          for (let i = event.first; i < dataCount; i++) {
            newDataArray.push(data[i]);
          }
        } else {
          this.displayMessage = this.noRecordFoundMsg;
        }

        this.artifactData = newDataArray;
      }, error => this.globalErrorHandler.handleError(error));
    } else if (this.artifactData) {
      const items = event.first + event.rows;
      if (this.allProjects.length) {
        for (let i = event.first; i < items; i++) {
          if (!this.allProjects[i]) {
            break;
          }
          this.artifactData.push(this.allProjects[i]);
        }
      }
      this.msgs = [];
      // tslint:disable-next-line:max-line-length
      // this.msgs.push({ severity: 'info', summary: this.dataLoadedMsg, detail:  this.dataLoadedbetweenMsg + event.first + this.dataLoadedAndMsg + (event.first + event.rows) });
    } else {
      this.displayMessage = this.noRecordFoundMsg;
    }
  }

  copyToClipboard(activeCopyURL: boolean): void {
    this.copyArtifactUrl = document.location.href;
    this.copyArtifactUrlPopup = activeCopyURL;
  }

  public yammerWindowPopup(ownername, prjName): void {
    this.copyToClipboard(false);
    yam.platform.yammerShareOpenPopup({
      customButton: true,
      defaultMessage: this.getYammerWindowPopupMessage(ownername, prjName),
      pageUrl: this.copyArtifactUrl.split('?')[0]
    });
  }

  private getYammerWindowPopupMessage(ownername, prjName): string {
    const projectName = prjName.replace(/\s/g, '%20');
    const ownerName = decodeURI(ownername).replace(/<\/?[^>]+(>|$)/g, '').replace(/%26amp%3B/g, '&');
    return projectName + ' --- ' + ownerName;
  }

  public checkedCategories(value) {
    if (value === this.uploadsLabel) {
      this.displayArtifactStatus = true;
      this.authSandbox.userUploadArtifacts();
      this.authSandbox.userUploadArtifacts$.subscribe((data: Artifact[]) => {
        if (data.length > 0) {
          this.artifactData = data;
          this.allProjects = data;
          this.displayMessage = '';
        } else {
          this.artifactData = [];
          this.displayMessage = this.noRecordFoundMsg;
        }
      }, error => this.globalErrorHandler.handleError(error));
    } else if (value === this.downloadsLabel) {
      this.displayArtifactStatus = false;
      this.authSandbox.userDownloadArtifacts();
      this.authSandbox.userDownloadArtifacts$.subscribe((data: Artifact[]) => {
        if (data.length > 0) {
          this.artifactData = data;
          this.allProjects = data;
          this.displayMessage = '';
        } else {
          this.artifactData = [];
          this.displayMessage = this.noRecordFoundMsg;
        }
      });
    } else if (value === this.favouritesLabel) {
      this.displayArtifactStatus = false;
      if (this.session) {
        this.authSandbox.userFavouriteArtifacts();
        this.authSandbox.userFavouriteArtifacts$.subscribe((data: Artifact[]) => {
          if (data.length > 0) {
            this.artifactData = data;
            this.allProjects = data;
            this.displayMessage = '';
          } else {
            this.artifactData = [];
            this.displayMessage = this.noRecordFoundMsg;
          }
        }, error => this.globalErrorHandler.handleError(error));
      } else {
        this.artifactData = [];
        this.displayMessage = this.noRecordFoundMsg;
      }
    }
  }

  changeUserProfileImage(file: any): void {
    this.uploadedImageType = file[0].type;
    this.ng2ImgToolsService.resize([file[0]], 200, 100).subscribe(result => {
      const imageFile = new File([result], result.name);
      const fileData = { file: imageFile, size: imageFile.size };
      if (this.uploadedImageType && (this.uploadedImageType === 'image/jpeg' ||
        this.uploadedImageType === 'image/png' || this.uploadedImageType === 'image/jpg')) {
        this.authSandbox.uploadUserProfileImage(fileData);
        this.authSandbox.uploadUserProfileImage$.subscribe(
          (response: UploadUserImageResponse) => {
            if (response && response.status === true) {
              let imgUrl = response.filePath;
              imgUrl = imgUrl.replace(/ /g, '%20');
              this.userDetails.profileImage =
                this.authSandbox.downloadUrl + '' + imgUrl.replace(/\\/g, '/');
              this.utilityService.profileImage$ = Observable.of(this.userDetails.profileImage);
              sessionStorage.setItem('USER_DETAILS', JSON.stringify(this.userDetails));
              this.messageService.add({
                severity: 'success',
                summary: this.successMsg,
                detail: response.msg
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.errorMessage,
                detail: response.msg
              });
            }
          },
          error => this.globalErrorHandler.handleError(error)
        );
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.errorMessage,
          detail: this.pleaseUploadValidImageValue
        });
      }

    }, error => {
    });    //
  }

  editProfile(): void {
    const userData = {
      username: this.userDetails.name,
      designation: this.userDetails.designation,
      userId: this.userDetails.userID
    };
    this.authSandbox.editUserData(userData);
    this.authSandbox.editUserProfile$.subscribe(
      (response: PostResponse) => {
        this.editProfilePopup = false;
        if (response && response.status === true) {
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            summary: this.successMsg,
            detail: response.msg
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.errorMessage,
            detail: response.msg
          });
        }
      },
      error => this.globalErrorHandler.handleError(error)
    );
  }
  cancelUpdate(): void {
    this.ngOnInit();
    this.editProfilePopup = false;
  }

  personalizeHome(): void {
    if (this.userDetails) {
      this.catPrefs = this.userDetails.categoryPrefs;
    }
    this.showCategory();
  }

  showCategory(): void {
    this.authSandbox.showAllCategories();
    this.authSandbox.allCategories$.subscribe(
      (response: Category[]) => {
        if (response) {
          this.allCategoriesLength = response.length;
          this.allCategories = response;
          // this.categoryPopup = true;
          this.selectedCategories = [];
          for (let i = 0; i < this.allCategoriesLength; i++) {
            this.allCategories[i].isChecked = false;
            if (this.catPrefs) {
              for (let j = 0; j < this.catPrefs.length; j++) {
                if (this.allCategories[i].catID === this.catPrefs[j].catID) {
                  this.allCategories[i].isChecked = true;
                  this.selectedCategories.push(this.allCategories[i].categoryName);

                }
              }
            }
          }
        }
      },
      error => this.globalErrorHandler.handleError(error)
    );
  }

  checkEvent(category: Category): void {
    for (let i = 0; i < this.allCategoriesLength; i++) {
      if (category.catID === this.allCategories[i].catID) {
        if (this.allCategories[i].isChecked === true) {
          this.allCategories[i].isChecked = false;
        } else {
          this.allCategories[i].isChecked = true;
        }
      }
      break;
    }
  }

  showCategoryResult(): void {
    const categoryArray = [];
    for (let i = 0; i < this.allCategoriesLength; i++) {
      if (this.allCategories[i].isChecked === true) {
        const selectedCategory = {
          catID: 0,
          listSubCategories: []
        };
        selectedCategory.catID = this.allCategories[i].catID;
        categoryArray.push(selectedCategory);
      }
    }
    if (categoryArray && categoryArray.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: this.errorMessage,
        detail: this.selectAtleastOneMainCategoryValue
      });
    } else {
      const categoryData = { categoryPrefs: JSON.stringify(categoryArray) };
      this.authSandbox.updateUserCategoriesPrefs(categoryData);
      this.authSandbox.updateUserCategoriesPrefs$.subscribe(
        (response: PostResponse) => {
          if (response && response.status === false) {
            this.messageService.add({
              severity: 'error',
              summary: this.errorMessage,
              detail: response.msg
            });
            this.categoryPopup = false;
          } else {
            this.ngOnInit();
            sessionStorage.setItem(
              'DownloadCategory',
              JSON.stringify(categoryArray)
            );
            sessionStorage.setItem(
              'RecentCategory',
              JSON.stringify(categoryArray)
            );

            const getPref = false;
            sessionStorage.setItem('GetPref', JSON.stringify(getPref));
            this.messageService.add({
              severity: 'success',
              summary: this.successMsg,
              detail: response.msg
            });
            this.categoryPopup = false;
          }
        },
        error => this.globalErrorHandler.handleError(error)
      );
    }
  }

  getProjectImage(imgUrl): string {
    if (!imgUrl) {
      imgUrl = 'images/Homepage/project-background-2.png';
      return imgUrl;
    }
    imgUrl = imgUrl.replace(/ /g, '%20');
    if (imgUrl !== '' && imgUrl) {
      const temp = this.authSandbox.downloadUrl + '' + imgUrl.replace(/\\/g, '/');
      return temp;
    }
  }

  showDialog(): void {
    this.display = true;
  }

  viewProject(projId: string, assetStatusId: string, isPublished: string): void {
    sessionStorage.setItem('PROJECT_ID', projId);
    sessionStorage.setItem('asset_Status', assetStatusId);
    sessionStorage.setItem('ispublished', isPublished);
    const viewProject = {
      projId: '',
      assetStatusId: '',
      isPublished: ''
    };
    if (assetStatusId !== 'AP') {
      sessionStorage.setItem('IS_USER', JSON.stringify(0));
    }
    viewProject.projId = projId;
    viewProject.assetStatusId = assetStatusId;
    viewProject.isPublished = isPublished;
    this.router.navigate([
      './artifacts/artifact-details/' + viewProject.projId
    ]);
  }
}
