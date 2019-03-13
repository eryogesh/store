import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { SearchSandbox } from './search.sandbox';

@Injectable()
export class SearchResolver implements Resolve<any> {

    private categoriesSubscription;

    constructor(public searchSandbox: SearchSandbox) { }

    /**
     * Triggered when application hits artifacts details route.
     * It subscribes to artifacts list data and finds one with id from the route params.
     *
     * @param route
     */
    public resolve(route: ActivatedRouteSnapshot) {

    }
}
