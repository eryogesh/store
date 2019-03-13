import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { ArtifactsSandbox } from './artifacts.sandbox';

@Injectable()
export class ArtifactsResolver implements Resolve<any> {

    private categoriesSubscription;

    constructor(public artifactsSandbox: ArtifactsSandbox) { }

    /**
     * Triggered when application hits artifacts details route.
     * It subscribes to artifacts list data and finds one with id from the route params.
     *
     * @param route
     */
    public resolve(route: ActivatedRouteSnapshot) {

    }
}
