export class Artifact {
  subCategoryName: any;
  projId: number;
  approverRemarks: string;
  projectType: string;
  description: string;
  isActive: number;
  versionName: string;
  categoryName: string;
  userID: number;
  features: string;
  userDownloaded: number;
  ownerName: string;
  ownerEmailID: string;
  imageUrl: string;
  versionNo: number;
  avgRating: number;
  viewCount: number;
  assetStatusId: string;
  profileMapping: string;
  isPublished: number;
  projectLastUpdate: string;
  projectPath: string;
  isReviewed: number;
  subCategoryId: number;
  tags: string;
  effortsInvested: number;
  size: number;
  projectName: string;
  categoryId: number;
  downloadCount: number;
  isFavorite: number;
  uploadType: string;
  assetSupportFiles: object;

  constructor(artifact: any = null) {
    this.projId = artifact ? artifact.projId : '';
    this.approverRemarks = artifact ? artifact.approverRemarks : '';
    this.projectType = artifact ? artifact.projectType : '';
    this.description = artifact ? artifact.description : '';
    this.isActive = artifact ? artifact.isActive : '';
    this.versionName = artifact ? artifact.versionName : '';
    this.categoryName = artifact ? artifact.categoryName : '';
    this.userID = artifact ? artifact.userID : '';
    this.features = artifact ? artifact.features : '';
    this.userDownloaded = artifact ? artifact.userDownloaded : '';
    this.ownerName = artifact ? artifact.ownerName : '';
    this.imageUrl = artifact ? artifact.imageUrl : '';
    this.versionNo = artifact ? artifact.versionNo : '';
    this.avgRating = artifact ? artifact.avgRating : '';
    this.viewCount = artifact ? artifact.viewCount : '';
    this.assetStatusId = artifact ? artifact.assetStatusId : '';
    this.profileMapping = artifact ? artifact.profileMapping : '';
    this.isPublished = artifact ? artifact.isPublished : '';
    this.projectLastUpdate = artifact ? artifact.projectLastUpdate : '';
    this.projectPath = artifact ? artifact.projectPath : '';
    this.isReviewed = artifact ? artifact.isReviewed : '';
    this.subCategoryId = artifact ? artifact.subCategoryId : '';
    this.tags = artifact ? artifact.tags : '';
    this.effortsInvested = artifact ? artifact.effortsInvested : '';
    this.size = artifact ? artifact.size : '';
    this.projectName = artifact ? artifact.projectName : '';
    this.categoryId = artifact ? artifact.categoryId : '';
    this.downloadCount = artifact ? artifact.downloadCount : '';
    this.isFavorite = artifact ? artifact.isFavorite : '';

  }
}

export class UploadTypes {
  assetFormat: string;
  assetFormatId: string;

  constructor() {
  }
}

export class TagResponse {
  status:boolean;
  data:String[] ;
}
