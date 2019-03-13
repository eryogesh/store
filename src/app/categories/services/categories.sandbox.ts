import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GlobalErrorHandler } from '../../error-handling/global-error-handler';
import { CategoriesForUpload, Category, User, CategoriesData } from '../../shared/models';
import { Sandbox } from '../../shared/sandbox/base.sandbox';
import { CategoriesApiClientService } from './categories-api-client.service';

@Injectable()
export class CategoriesSandbox extends Sandbox {
    public categories$: Observable<Category[]>;
    public categoriesForUpload$: Observable<CategoriesForUpload>;
    public loggedUser$ = Observable.of<User>(new User(JSON.parse(sessionStorage.getItem('currentUser'))));
    private subscriptions: Array<Subscription> = [];
    public categoriesData$: Observable<CategoriesData>;

    constructor(
        private categoriesApiClient: CategoriesApiClientService,
        private globalErrorHandler: GlobalErrorHandler
    ) {
        super();
        this.registerEvents();
    }
    public getCategoriesDataFun(): Observable<CategoriesData> {
        this.categoriesData$ = this.categoriesApiClient.getCategoriesData();
        return this.categoriesData$;
    }
    /**
     * Loads categories from the server
     */
    public loadCategories(): void {
        this.categories$ = this.categoriesApiClient.getCategories();
    }

    public loadCategoriesForUpload(parentCatId: number): void {
        this.categoriesForUpload$ = this.categoriesApiClient.getCategoriesForUpload(parentCatId);
    }

    /**
     * Unsubscribes from events
     */
    public unregisterEvents() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Subscribes to events
     */
    private registerEvents(): void {
        // // Subscribes to culture
        // this.subscriptions.push(this.culture$.subscribe((culture: string) => this.culture = culture));
        this.getCategoriesDataFun();
        this.subscriptions.push(this.loggedUser$.subscribe((user: User) => {
            this.loadCategories();
        }));
    }
}
