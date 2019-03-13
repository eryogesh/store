import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { AdminSandbox } from './admin.sandbox';

@Injectable()
export class CategoriesResolver implements Resolve<any> {

    private categoriesSubscription;

    constructor(public AdminSandbox: AdminSandbox) { }

    /**
     * Triggered when application hits category details route.
     * It subscribes to category list data and finds one with id from the route params.  
     *
     * @param route
     */
    public resolve(route: ActivatedRouteSnapshot) {
        // if (this.categoriesSubscription) { return; }

        // this.categoriesSubscription = this.categoriesSandbox.productDetails$.subscribe(category => {
        //     if (!category) {
        //         this.categoriesSandbox.loadProductDetails(parseInt(route.params.id));
        //         return;
        //     }

        //     this.categoriesSandbox.selectProduct(category);
        // });
    }
}