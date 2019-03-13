import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppSandbox } from '../../app.sandbox';
import { CategoriesApiClientService } from '../../categories/services/categories-api-client.service';
import { GlobalErrorHandler } from '../../error-handling/global-error-handler';
import { User } from '../../shared/models';
import { UserDetails } from '../../shared/models/auth/login.model';
import { ArtifactSearchResponse } from '../../shared/models/post-response.model';
import { Sandbox } from '../../shared/sandbox/base.sandbox';
import { UtilityService } from '../../shared/utility';
import { SearchApiClientService } from './search-api-client.service';

const kwIsUser = 'IS_USER';
const kwUserDetails = 'USER_DETAILS';
const kwDownloadCategory = 'DownloadCategory';
const kwRecentCategory = 'RecentCategory';

@Injectable()
export class SearchSandbox extends Sandbox {

    public displayMessage = '';
    public totalRecords: number;
    public downloadUrl: string;
    private subscriptions: Array<Subscription> = [];
    private downloadCategory: any;
    private recentCategory: any;
    private usrID = -1;
    private sesnID: string;
    private uniqID: string;

    private userDetails: UserDetails;

    constructor( // protected appState$: Store<store.State>,
        private searchApiClient: SearchApiClientService,
        private categoriesApiClientService: CategoriesApiClientService,
        private appSandbox: AppSandbox,
        private utilityService: UtilityService, private globalErrorHandler: GlobalErrorHandler) {
        super();
        this.registerEvents();

    }

    /**
     * @description load search will takecare of all initial load variables.
     */
    public loadSearch(): void {
        const sessionData = this.utilityService.getSessionData();
        const isUser = '1';
        this.downloadUrl = this.searchApiClient.downloadUrl;
        sessionStorage.setItem(kwIsUser, isUser);
        const usrData = sessionStorage.getItem(kwUserDetails);
        if (usrData) {
            this.userDetails = JSON.parse(usrData);
        }
        if (sessionData) {
            this.usrID = sessionData.userId;
            this.sesnID = sessionData.sessionId;
            this.uniqID = sessionData.uniqueId;
        }
        this.downloadCategory = sessionStorage.getItem(kwDownloadCategory);
        this.recentCategory = sessionStorage.getItem(kwRecentCategory);
    }

    public searchArtifact(searchString: string, startIndex: number = 0, pageSize: number = 12): Observable<ArtifactSearchResponse> {
        const sessionData = this.utilityService.getSessionData();
        const isUser = '1';
        this.downloadUrl = this.searchApiClient.downloadUrl;
        sessionStorage.setItem(kwIsUser, isUser);
        const usrData = sessionStorage.getItem(kwUserDetails);
        if (usrData) {
            this.userDetails = JSON.parse(usrData);
        }
        if (sessionData) {
            this.usrID = sessionData.userId;
            this.sesnID = sessionData.sessionId;
            this.uniqID = sessionData.uniqueId;
        }
        let profileId;
        if (this.userDetails && this.userDetails.userAccess) {
            profileId = this.userDetails.userAccess.profileId;
        } else {
            profileId = '';
        }

        const data = {
            userId: this.usrID, profileMapping: profileId, sessionAuthKey: this.sesnID, uniqueId: this.uniqID,
            searchString: decodeURIComponent(searchString.toLowerCase()), startIndx: startIndex, pageSize: pageSize
        };
        return this.searchApiClient.searchAssetWighPaging(data);
    }

    /**
     * Unsubscribes from events
     */
    public unregisterEvents(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Subscribes to events
     */
    private registerEvents(): void {
        // Subscribes to culture
        // this.subscriptions.push(this.culture$.subscribe((culture: string) => this.culture = culture));
        this.subscriptions.push(this.utilityService.getLoggedUser().subscribe((user: User) => {
            this.loadSearch();
        }));
    }
}
