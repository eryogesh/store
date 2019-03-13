import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Artifact, Category, User } from '../../shared/models';
import { AssetApproval } from '../../shared/models/admin/asset-approval.modal';
import { UserApprovals } from '../../shared/models/admin/user-approvals.modal';
import { UserAccessSearchEmailResponse } from '../../shared/models/admin/user-access-search-email.modal';
import { UserProfiles } from '../../shared/models/admin/user-profiles.modal';
import { UserRole } from '../../shared/models/admin/user-roles.modal';
import { CategoriesResponse } from '../../shared/models/categories/categories-response.model';
import { PostResponse, ArtifactResponse } from '../../shared/models/post-response.model';
import { Sandbox } from '../../shared/sandbox/base.sandbox';
import { AdminApiClientService } from './admin-api-client.service';


@Injectable()
export class AdminSandbox extends Sandbox {
    public categoriesResponse$: Observable<CategoriesResponse>;
    public categories$: Observable<Category[]>;
    public subcategories$: Observable<Category[]>;
    public postResponse$: Observable<PostResponse>;
    public updateStatusCategory$: Observable<Category[]>;
    public UserAccessApproval$: Observable<UserApprovals[]>;
    public UserRole$: Observable<UserRole[]>;
    public UserProfiles$: Observable<UserProfiles[]>;
    public UserAccessSearchResponse$: Observable<UserAccessSearchEmailResponse[]>;
    public assetApprovalDetails$: Observable<Artifact[]>;
    public viewAssetDetails$: Observable<ArtifactResponse>;
    public downloadUrl: string;
    public download$: Observable<PostResponse>;
    public deleteAsset$: Observable<PostResponse>;
    public saveApprovedAssets$: Observable<PostResponse>;



    public loggedUser$ = Observable.of<User>(new User(JSON.parse(sessionStorage.getItem('currentUser'))));
    private subscriptions: Array<Subscription> = [];
    constructor(
        private adminApiClient: AdminApiClientService
    ) {
        super();
        this.registerEvents();
    }

    public loadCategories(): void {
        this.categoriesResponse$ = this.adminApiClient.getCategories();
        this.downloadUrl = this.adminApiClient.downloadUrl;
    }


    public loadSubCategories(): void {
        this.subcategories$ = this.adminApiClient.getAllsubCategories();
    }

    public createCategory(data): void {
        this.postResponse$ = this.adminApiClient.createCategory(data);
    }
    public updateCategoryStatus(data): void {
        this.postResponse$ = this.adminApiClient.updateCategoryStatus(data);
    }

    public updateSubcategoryStatus(data): Observable<PostResponse> {
        return this.adminApiClient.updateSubcategoryStatus(data);
    }

    public getUsersToApprove(): void {
        this.UserAccessApproval$ = this.adminApiClient.getUsersToApprove();
    }

    public getUserRoles(): void {
        this.UserRole$ = this.adminApiClient.getUserRoles();
    }
    public getUserProfiles(): void {
        this.UserProfiles$ = this.adminApiClient.getUserProfiles();
    }
    public getEmailUserAccessData(data): void {
        this.UserAccessSearchResponse$ = this.adminApiClient.getEmailUserAccessData(data);
    }
    public approveUser(data): Observable<PostResponse> {
        return this.postResponse$ = this.adminApiClient.approveUser(data);
    }
    public getAssetsToapprove(): void {
        this.assetApprovalDetails$ = this.adminApiClient.getAssetsToapprove();
    }

    public getAssetDetails(id): void {
      this.viewAssetDetails$ = this.adminApiClient.getAssetDetails(id);
    }
    public downloadArtifactCall(data) {
        return this.download$ = this.adminApiClient.downloadArtifact(data);
    }

    public DeleteAsset(data) {
        return this.deleteAsset$ = this.adminApiClient.DeleteAsset(data);
    }

    public saveApprovedAssets(data) {
        return this.saveApprovedAssets$ = this.adminApiClient.saveApprovedAssets(data);
    }
    public unregisterEvents() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Subscribes to events
     */
    private registerEvents(): void {
        // // Subscribes to culture
        // this.subscriptions.push(this.culture$.subscribe((culture: string) => this.culture = culture));

        this.loadCategories();
        this.getUsersToApprove();
        this.getUserRoles();
        this.getUserProfiles();
        this.getAssetsToapprove();

        // this.subscriptions.push(this.loggedUser$.subscribe((user: User) => {
        //     this.loadCategories();
        // }));
    }

}
