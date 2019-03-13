export class AssetApproval {
    projId: number;
    approverRemarks: string;
    projectType: string;
    isActive: number;
    versionName: number;
    categoryName: string;
    userID: number;
    subCategoryName: string;
    userDownloaded: number;
    ownerName: string;
    ownerImage: string;
    versionNo: number;
    avgRating: number;
    assetStatusId: number;
    profileMapping: string;
    projectPath: string;
    projectLastUpdate: string;
    isPublished: number;
    isReviewed: number;
    subCategoryId: number;
    tags: string;
    effortsInvested: number;
    size: number;
    projectName: string;
    downloadCount: number;
    categoryId: number;
    isFavorite: number;

    constructor(assetApprovalInfo?: AssetApproval) {
        this.projId = assetApprovalInfo ? assetApprovalInfo.projId : 0;
        this.approverRemarks = assetApprovalInfo ? assetApprovalInfo.approverRemarks : '';
        this.projectType = assetApprovalInfo ? assetApprovalInfo.projectType : '';
        this.isActive = assetApprovalInfo ? assetApprovalInfo.isActive : 0;
        this.versionName = assetApprovalInfo ? assetApprovalInfo.versionName : 0;
        this.categoryName = assetApprovalInfo ? assetApprovalInfo.categoryName : '';
        this.userID = assetApprovalInfo ? assetApprovalInfo.userID : 0;
        this.subCategoryName = assetApprovalInfo ? assetApprovalInfo.subCategoryName : '';
        this.userDownloaded = assetApprovalInfo ? assetApprovalInfo.userDownloaded : 0;
        this.ownerName = assetApprovalInfo ? assetApprovalInfo.ownerName : '';
        this.ownerImage = assetApprovalInfo ? assetApprovalInfo.ownerImage : '';
        this.versionNo = assetApprovalInfo ? assetApprovalInfo.versionNo : 0;
        this.avgRating = assetApprovalInfo ? assetApprovalInfo.avgRating : 0;
        this.assetStatusId = assetApprovalInfo ? assetApprovalInfo.assetStatusId : 0;
        this.profileMapping = assetApprovalInfo ? assetApprovalInfo.profileMapping : '';
        this.projectPath = assetApprovalInfo ? assetApprovalInfo.projectPath : '';
        this.projectLastUpdate = assetApprovalInfo ? assetApprovalInfo.projectLastUpdate : '' ;
        this.isPublished = assetApprovalInfo ? assetApprovalInfo.isPublished : 0;
        this.isReviewed = assetApprovalInfo ? assetApprovalInfo.isReviewed : 0;
        this.subCategoryId = assetApprovalInfo ? assetApprovalInfo.subCategoryId : 0;
        this.tags = assetApprovalInfo ? assetApprovalInfo.tags : '';
        this.effortsInvested = assetApprovalInfo ? assetApprovalInfo.effortsInvested : 0;
        this.size = assetApprovalInfo ? assetApprovalInfo.size : 0;
        this.projectName = assetApprovalInfo ? assetApprovalInfo.projectName : '';
        this.downloadCount = assetApprovalInfo ? assetApprovalInfo.downloadCount : 0;
        this.categoryId = assetApprovalInfo ? assetApprovalInfo.categoryId : 0;
        this.isFavorite = assetApprovalInfo ? assetApprovalInfo.isFavorite : 0;







    }
}
