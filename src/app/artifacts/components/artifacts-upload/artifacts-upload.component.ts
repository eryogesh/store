import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesSandbox } from '../../../categories/services/categories.sandbox';
import { ArtifactsSandbox } from '../../../artifacts/services/artifacts.sandbox';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';
import { ArtifactResponse } from '../../../shared/models/post-response.model';
import { CategoriesForUpload, Category, UploadArtifactFilesResponse, UploadArtifactResponse, UploadTypes } from '../../../shared/models';
import { ConfirmationService } from 'primeng/api';
import { UploadFile } from '../../../shared/models/artifacts/uploadFile.model';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { TagsComponent } from '../../../shared/components/tags/tags.component';

@Component({
  selector: 'cs-artifacts-upload',
  templateUrl: './artifacts-upload.component.html',
  styleUrls: ['./artifacts-upload.component.css']
})
export class ArtifactsUploadComponent implements OnInit, OnDestroy {
  public items: any = [];
  constructor(private artifactsSandbox: ArtifactsSandbox,
    private categoriesSandbox: CategoriesSandbox,
    private messageService: MessageService,
    private router: Router,
    private globalErrorHandler: GlobalErrorHandler,
    private confirmationService: ConfirmationService,
    private ng2ImgToolsService: Ng2ImgToolsService) {

    this.createUploadForm();
    this.createForm();
  }

  public uploadForm: FormGroup;
  public categories: Category[];
  public subcategories: Category[];
  public fileCollection = [];
  private filecollectionToPost = [];
  public uploadTypes: UploadTypes[];
  private parentId = 0;
  private supportexistingFiles = [];
  private existingFile = [];
  private selectedSubCatgegoryID: number;
  public uploadFilesResponse = {
    supportProjectFiles: '',
    uploadProjectFiles: ''
  };
  public projectName: FormControl;
  public tags: FormControl;
  public category: FormControl;
  public subcategory: FormControl;
  public description: FormControl;
  public features: FormControl;
  public efforts: FormControl;
  public versionName: FormControl;
  public uploadType: FormControl;
  public uploadAssets: FormControl;
  public supportDocs: FormControl;
  public projectIcon: FormControl;
  public selectedArtifactData: any = {};
  public isZip = false;
  public files = [];
  public filesValid = [];
  public supportDocsCollection = [];
  public supportDocscollectionToPost = [];
  public isUpload = false;
  public isZipdelete = false;
  public isIpa = false;
  public isIpadelete = false;
  public selectedfilenumber = false;
  public selectedfileerror = false;
  public supportDocsNumber = false;
  public isVersionSmall = false;
  public imageOnly = false;
  public selectedfileiconerror = false;
  public projectIconUrl: string;
  public displayProjectIcon = false;
  public isEditClicked: boolean;
  public projectImgUrl: string;
  private supportDocsImgType: string;
  private projectIconImgType: string;
  public selectedCategory = {
    catID: 0,
    categoryName: ''
  };
  public selectedSubCategory = {
    catID: 0,
    categoryName: ''
  };
  public versionUpdate = false;
  private prjSize: number;
  public subCategoryDisable = true;

  createUploadForm() {
    this.projectName = new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      Validators.minLength(2)
    ]);
    this.tags = new FormControl('');
    this.category = new FormControl('', Validators.required);
    this.subcategory = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.features = new FormControl('', Validators.required);
    this.efforts = new FormControl('', [
      Validators.required,
      Validators.pattern(/^([1-9][0-9]*)$/),
    ]);
    this.versionName = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[1-9]+(\.[0-9]?)?/),
    ]);
    this.uploadType = new FormControl('', Validators.required);
    this.uploadAssets = new FormControl('', Validators.required);
    this.supportDocs = new FormControl('');
    this.projectIcon = new FormControl('', Validators.required);
  }
  createForm() {
    this.uploadForm = new FormGroup({
      projectName: this.projectName,
      tags: this.tags,
      category: this.category,
      subcategory: this.subcategory,
      description: this.description,
      features: this.features,
      efforts: this.efforts,
      versionName: this.versionName,
      uploadType: this.uploadType,
      uploadAssets: this.uploadAssets,
      supportDocs: this.supportDocs,
      projectIcon: this.projectIcon
    });
  }
  ngOnInit() {
    this.isEditClicked = JSON.parse(sessionStorage.getItem('isEdit'));
    if (this.isEditClicked && this.isEditClicked === true) {
      const projectId = JSON.parse(sessionStorage.getItem('PROJECT_ID'));
      if (projectId) {
        this.getSelectedArtifactData(projectId);
      }
    }
    this.loadCategories(this.parentId);
    this.getUploadTypeList();
  }

  getSelectedArtifactData(projectId): void {
    let defIsUser = JSON.parse(sessionStorage.getItem('IS_USER'));
    if (!defIsUser) {
      defIsUser = 1;
    }
    const assetStatusId = sessionStorage.getItem('asset_Status');
    const profileMapping = sessionStorage.getItem('PROFILE_ID');
    const isPublished = sessionStorage.getItem('ispublished');

    this.artifactsSandbox.artifactDetails(projectId, profileMapping, assetStatusId, isPublished);
    this.artifactsSandbox.artifactDetails$.subscribe((response: ArtifactResponse) => {
      if (response && response.assetList && response.assetList.length > 0) {
        this.versionUpdate = true;
        this.selectedArtifactData = response.assetList[response.assetList.length - 1];
        this.projectName.setValue(this.selectedArtifactData.projectName);
        this.description.setValue(decodeURIComponent(this.selectedArtifactData.description));
        this.features.setValue(decodeURIComponent(this.selectedArtifactData.features));
        this.tags.setValue(this.selectedArtifactData.tags);
        this.projectImgUrl = this.artifactsSandbox.downloadUrl + this.selectedArtifactData.imageUrl.replace(/\\/g, '/');
        this.projectIcon.setValue(this.projectImgUrl);
        this.category.setValue([{
          'categoryName': this.selectedArtifactData.categoryName,
          'catID': this.selectedArtifactData.categoryId
        }]);
        this.subcategory.setValue([{
          'categoryName': this.selectedArtifactData.subCategoryName,
          'catID': this.selectedArtifactData.subCategoryId
        }]);
        this.selectedCategory = {
          categoryName: this.selectedArtifactData.categoryName,
          catID: this.selectedArtifactData.categoryId
        };
        this.selectedSubCategory = {
          categoryName: this.selectedArtifactData.subCategoryName,
          catID: this.selectedArtifactData.subCategoryId
        };
        this.efforts.setValue(this.selectedArtifactData.effortsInvested);
        this.loadCategories(this.selectedCategory.catID);
        const type = this.selectedArtifactData.uploadType;
        const selectedUploadType = this.uploadTypes.find(function (element) {
          return element.assetFormatId === type;
        });
        this.uploadTypes = [{ 'assetFormatId': selectedUploadType.assetFormatId, 'assetFormat': selectedUploadType.assetFormat }];
        this.supportexistingFiles = [];
        this.existingFile = [];
        if (this.selectedArtifactData.projectPath) {
          this.selectedArtifactData.projectPath = this.selectedArtifactData.projectPath.replace(/\\/g, '/');
          let url = this.artifactsSandbox.downloadUrl + this.selectedArtifactData.projectPath;
          if (url.indexOf('plist') !== -1) {
            url = 'itms-services://?action=download-manifest&url=' + url;
          }
        }

        const assetFiles = this.selectedArtifactData.assetSupportFiles;
        if (assetFiles) {
          for (let loop = 0, loopLen = assetFiles.length; loop < loopLen; loop++) {
            if (assetFiles[loop].isSupportFile === 1) {
              const isSupportFiles = true;
              let assetUrl = assetFiles[loop].assetSupportFileName;
              assetUrl = assetUrl.replace(/\\/g, '/');
              assetUrl = this.artifactsSandbox.downloadUrl + assetUrl;
              assetFiles[loop].assetSupportFileName = assetUrl;
              const fileName = assetUrl.substring(assetUrl.lastIndexOf('/') + 1);
              this.supportexistingFiles.push({ 'name': fileName });
            } else {
              let assetUrl = assetFiles[loop].assetSupportFileName;
              assetUrl = assetUrl.replace(/\\/g, '/');
              assetUrl = this.artifactsSandbox.downloadUrl + assetUrl;

              const fileName = assetUrl.substring(assetUrl.lastIndexOf('/') + 1);
              this.existingFile.push({ 'name': fileName });
            }
          }
        }
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  loadCategories(parentId: number): void {
    this.parentId = parentId;
    this.categoriesSandbox.loadCategoriesForUpload(parentId);
    this.categoriesSandbox.categoriesForUpload$.subscribe((categoryList: CategoriesForUpload) => {
      if (categoryList && this.parentId === 0) {
        this.categories = categoryList.categories;
      } else {
        this.subcategories = categoryList.categories;
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  removeAssetFile(index: number, fileName: string): void {
    const fileRemove = this.filecollectionToPost.find(function (selectedFile) {
      return selectedFile[0].name === fileName;
    });
    const type = fileRemove[0].type;
    if (type.indexOf('ipa') !== -1) {
      this.isIpadelete = false;
    }
    if (type.indexOf('zip') === -1) {
      if (this.fileCollection.length < 2) {
        this.isZipdelete = false;
      }
    } else {
      let enter = false;
      for (let loop = 0, loopLen = this.fileCollection.length; loop < loopLen; loop++) {
        const name = this.fileCollection[loop];
        if (name.indexOf('zip') !== -1) {
          this.isZip = true;
          enter = true;
          break;
        }
      }
      if (enter === false) {
        this.isZip = false;
        this.isZipdelete = false;
      }
      if (enter === true && this.fileCollection.length === 1) {
        this.isZip = false;
        this.isZipdelete = false;
      }
    }
    this.filecollectionToPost.splice(index, 1);
    this.fileCollection.splice(index, 1);
    this.uploadAssets.setValue(this.filecollectionToPost);
    this.selectedfileerror = false;
    this.selectedfilenumber = false;
    this.isZipdelete = false;
  }

  removeSupportingDocs(index: number): void {
    this.supportDocsCollection.splice(index, 1);
    this.supportDocscollectionToPost.splice(index, 1);
    this.supportDocsNumber = false;
    this.supportDocs.setValue(this.supportDocscollectionToPost);
  }

  loadSubCategories(subCategoryId: number): void {
    this.loadCategories(subCategoryId);
  }

  selectSubCategory(subCategoryId: number): void {
    this.selectedSubCatgegoryID = subCategoryId;
    this.subCategoryDisable = false;
  }

  onUploadTypeChange(uploadTypeFormat: string): void {
    if (uploadTypeFormat === 'POC' || uploadTypeFormat === 'DEM') {
      this.isUpload = true;
      this.uploadForm.controls['supportDocs'].setValidators([Validators.required]);
      this.uploadForm.controls['supportDocs'].updateValueAndValidity();
    } else {
      this.isUpload = false;
      this.uploadForm.controls['supportDocs'].clearValidators();
      this.uploadForm.controls['supportDocs'].updateValueAndValidity();
    }
  }

  getUploadTypeList(): void {
    this.artifactsSandbox.getUploadTypes();
    this.artifactsSandbox.artifactsUploadtype$.subscribe(data => {
      this.uploadTypes = data;
    }, error => this.globalErrorHandler.handleError(error));
  }

  getTagsList(files): void {
    const formData = new FormData();
    formData.append('file', files[0]);
    this.artifactsSandbox.getTagsList(formData);
    this.artifactsSandbox.uploadTagsList$.subscribe(data => {

      if (this.items.length === 0) {
        this.items = data.data;
      } else {
        this.items = this.items.concat(data.data);
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  onAssetDrop(event): void {
    if (event) {
      const dataTransfer = event.dataTransfer.getData('data');
      event.preventDefault();
      this.onAssetUpload(event.dataTransfer.files);
    }
  }

  onAssetUpload(event) {
    if (!event) {
      return false;
    }
    this.files = event.target.files;
    this.selectedfileerror = false;
    this.isIpadelete = false;
    this.isZipdelete = false;

    if (this.fileCollection && this.fileCollection.length < 4) {
      if (!this.files[0]) {
        return false;
      }
      let projectSize = this.files[0].size;
      projectSize = ((projectSize) / (1024 * 1024));
      const filePath = this.files[0].name;
      if (filePath.indexOf('zip') !== -1) {
        this.isZip = true;
      } else if (this.isZip === true && this.fileCollection.length >= 1 && filePath.indexOf('zip') === -1) {
        const selectedUploadType = this.filecollectionToPost.find(function (element) {
          return element[0].name.indexOf('zip') !== -1;
        });
        if (selectedUploadType) {
          this.isZip = true;
          this.isZipdelete = true;
          return false;
        }
        this.isZip = false;
        this.isZipdelete = false;
      } else {
        this.isZip = false;
      }
      if (projectSize > 100) { // file size validation
        this.selectedfileerror = true;
      } else if (this.isZip === true && this.fileCollection.length >= 1) { // only one zip uploaded validation
        this.isZip = true;
        this.isZipdelete = true;
      } else if (this.isIpa === true && filePath.indexOf('ipa') !== -1) {
        this.isIpadelete = true;
      } else {
        this.filecollectionToPost.push(this.files);
        this.fileCollection.push(this.files[0].name);
        this.uploadAssets.setValue(this.filecollectionToPost);
      }
    } else {
      this.selectedfilenumber = true;
    }
    const fileExt = event.target.files[0].name;
    // Get Tags List on file upload
    if (fileExt.indexOf('doc') !== -1 ||
      fileExt.indexOf('DOCX') !== -1 ||
      fileExt.indexOf('pptx') !== -1 ||
      fileExt.indexOf('pdf') !== -1 ||
      fileExt.indexOf('zip') !== -1) {
      this.getTagsList(event.target.files);
    }
  }

  onSupportDocsDrop(event): void {
    if (event) {
      const dataTransfer = event.dataTransfer.getData('data');
      event.preventDefault();
      this.onSupportDocsUpload(event.dataTransfer.files);
    }
  }

  onSupportDocsUpload(event): void {
    if (event && event[0] && event[0].type) {
      this.supportDocsNumber = false;
      this.imageOnly = false;
      this.supportDocsImgType = event[0].type;
      if (this.supportDocsCollection && this.supportDocsCollection.length < 4) {
        if (this.supportDocsImgType.indexOf('image') === -1) { // file size validation
          this.imageOnly = true;
        } else {
          this.ng2ImgToolsService.resize([event[0]], 450, 850).subscribe(result => {
            const fileArry = [];
            fileArry.push(new File([result], result.name));
            this.supportDocscollectionToPost.push(fileArry);
            this.supportDocsCollection.push(fileArry[0].name);
            this.supportDocs.setValue(this.supportDocscollectionToPost);
          });
        }
      } else {
        this.supportDocsNumber = true;
      }

    }
  }

  allowDrop(event): void {
    event.preventDefault();
  }

  updateTags(event): void {
    this.items = event;
  }

  getFileDetails(event): void {
    if (this.filesValid && this.filesValid.length < 4) {
      if (this.isZip === true) {
        this.isZipdelete = true;
      } else {
        // STORE THE FILE OBJECT IN AN ARRAY.
        for (let i = 0, ilen = event.fileCollection.length; i < ilen; i++) {
          this.filesValid.push(event.fileCollection[i]);
          const filePath = event.fileCollection[0].name;
          if (this.isIpa === true) {
            if (filePath.indexOf('ipa') !== -1) {
              this.isIpadelete = true;
              return;
            }
          }
          if (filePath.indexOf('ipa') !== -1) {
            this.isIpa = true;
          }
          if (filePath.indexOf('zip') !== -1) {
            this.isZip = true;
            if (this.filesValid.length > 1) {
              this.isZipdelete = true;
            }
          }
        }
      }
    } else {
      this.selectedfilenumber = true;
    }
  }

  projectIconFile(event): void {
    if (event) {
      this.projectIconImgType = event[0].type;
      this.ng2ImgToolsService.resize([event[0]], 450, 300).subscribe(result => {
        const imageFile = new File([result], result.name);

        this.uploadForm.value.projectIcon = imageFile;
        this.projectIcon.setValue(imageFile);

        const reader = new FileReader();
        reader.onload = (event1: any) => {
          this.projectIconUrl = event1.target.result;
          // document.getElementById('selectedIconID').className = 'fileIconCls';
          document.getElementById('selectedIconID').className = 'afterFileAdd';
          this.displayProjectIcon = true;
        };
        reader.readAsDataURL(imageFile);
      });
    }
  }

  homePage() {
    const isEdit = false;
    sessionStorage.setItem('isEdit', JSON.stringify(isEdit));
    this.router.navigate(['./artifacts/artifact-list']);
  }

  saveUploadedArtifact() {
    if (!this.fileCollection) {
      this.selectedfileerror = true;
      return false;
    } else {
      this.prjSize = 0;
      const projectFile = this.filecollectionToPost[0];
      // tslint:disable-next-line:forin
      for (let i = 0; i < projectFile.length; i++) {
        this.prjSize = this.prjSize + projectFile[i].size;
      }
      this.prjSize = ((this.prjSize) / (1024 * 1024));
      if (this.prjSize > 100) {
        this.selectedfileerror = true;
        return false;
      } else {
        this.selectedfileerror = false;
      }
    }

    // added by arvind  for check app or non app type

    const appType = this.isApptype(this.fileCollection) ? 'app' : 'nonapp';
    let isNewVersion = 1;
    let projectId = 0;
    let versionNumber = 1;
    this.isEditClicked = JSON.parse(sessionStorage.getItem('isEdit'));
    if (this.isEditClicked === true) {
      if (this.selectedArtifactData && this.selectedArtifactData.versionName > this.versionName) {
        this.isVersionSmall = true;
        return false;
      }
      isNewVersion = 0;
      projectId = JSON.parse(sessionStorage.getItem('PROJECT_ID'));
    }
    let fileIcon = this.uploadForm.value.projectIcon;
    let fileSize;
    if (!fileIcon) {
      if (this.isEditClicked === true) {
        fileIcon = null;
        fileSize = 24534785;
      } else {
        this.selectedfileiconerror = true;
        return false;
      }
    }
    if (fileIcon && this.isEditClicked === false) {
      if (this.projectIconImgType.indexOf('image') === -1) {
        this.selectedfileiconerror = true;
        return false;
      } else {
        this.selectedfileiconerror = false;
        fileSize = fileIcon.size;
      }
    } else {
      this.selectedfileiconerror = false;
      fileSize = fileIcon.size;
    }
    const tagsNext = this.items.toString();
    const session = JSON.parse(sessionStorage.getItem('sessionData'));
    const save_data = {
      projectName: this.uploadForm.value.projectName,
      // tags: this.uploadForm.value.tags,
      tags: tagsNext,
      uploadType: this.uploadForm.value.uploadType,
      categoryId: this.uploadForm.value.category,
      size: fileSize,
      subCategoryId: this.uploadForm.value.subcategory,
      description: encodeURIComponent(this.uploadForm.value.description.replace(/\n/g, '<br/>')),
      features: encodeURIComponent(this.uploadForm.value.features.replace(/\n/g, '<br/>')),
      efforts: this.uploadForm.value.efforts,
      versionName: this.uploadForm.value.versionName,
      assetId: projectId,
      userId: session.userId,
      sessionAuthKey: session.sessionId,
      uniqueId: session.uniqueId,
      type: appType
    };
    this.artifactsSandbox.saveProjectAndFile(save_data, fileIcon, isNewVersion);
    this.artifactsSandbox.projectSave$.subscribe((data: UploadArtifactResponse) => {
      if (data) {
        this.isVersionSmall = false;
        const fd = new FormData();
        this.filecollectionToPost.forEach(function (assetFile) {
          fd.append('projectFiles', assetFile[0]);
        });
        this.supportDocscollectionToPost.forEach(function (assetSupportFile) {
          fd.append('supportingFiles', assetSupportFile[0]);
        });
        if (this.isEditClicked === true) {
          versionNumber = JSON.parse(data.versionNo);
        }
        const arr = [];
        const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        const zipContenArr = JSON.stringify(arr);
        fd.append('zipContents', zipContenArr);
        fd.append('size', JSON.stringify(this.prjSize));
        fd.append('isProjectFile', '1');
        fd.append('assetId', data.assetId);
        fd.append('versionNumber', JSON.stringify(versionNumber));
        fd.append('userId', sessionData.userId);
        fd.append('sessionAuthKey', sessionData.sessionId);
        fd.append('uniqueId', sessionData.uniqueId);

        this.artifactsSandbox.uploadProjectFiles(fd);
        this.artifactsSandbox.projectFiles$.subscribe((response: UploadArtifactFilesResponse) => {
          if (response) {
            this.uploadFilesResponse.supportProjectFiles = response.supportProjectFiles;
            this.uploadFilesResponse.uploadProjectFiles = response.uploadProjectFiles;
            if (response.status === 'Success') {
              const isEdit = false;
              sessionStorage.setItem('isEdit', JSON.stringify(isEdit));
              this.confirmationService.confirm({
                message: '',
                accept: () => {
                  this.router.navigate(['./artifacts/artifact-list']);
                },
                reject: () => {
                  this.router.navigate(['./artifacts/artifact-list']);
                }
              });
            }
          }
        }, error => this.globalErrorHandler.handleError(error));
      }
    });
  }
  isApptype(_filecollection: any): boolean {

    const appExtenstion: string[] = ['xap', 'appx ', 'apk', 'ipa', 'plist'];
    let bappType = false;
    for (let loop = 0, loopLen = _filecollection.length; loop < loopLen; loop++) {

      const fileExtension = _filecollection[loop].substr(_filecollection[loop].lastIndexOf('.') + 1).toLowerCase();
      if (appExtenstion.indexOf(fileExtension) !== -1) {
        bappType = true;
        break;
      }

    }
    return bappType;

  }
  ngOnDestroy() {
    const isEdit = false;
    sessionStorage.setItem('isEdit', JSON.stringify(isEdit));
  }
}
