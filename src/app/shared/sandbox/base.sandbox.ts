import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { User } from '../models';
import { localeDateString } from '../utility';

// import { Store } from '@ngrx/store';
// import * as store from '../store';
// import * as authActions from '../store/actions/auth.action';
// import { User } from '../models';

export abstract class Sandbox {
    // public loggedUser$: Observable<any> = this.appState$.select(store.getLoggedUser);
    // public culture$: Observable<any> = this.appState$.select(store.getSelectedCulture);
    // public culture: string;

    constructor(
        // protected appState$: Store<store.State>
    ) { }

    /**
     * Pulls user from local storage and saves it to the store
     */
    public loadUser(): void {
        // const user = JSON.parse(sessionStorage.getItem('currentUser'));
        // this.appState$.dispatch(new authActions.AddUserAction(new User(user)));
    }

    /**
     * Formats date string based on selected culture
     *
     * @param value
     */
    public formatDate(value: string, culture: string = 'en-EN') {
        return localeDateString(value, culture);
    }
}
