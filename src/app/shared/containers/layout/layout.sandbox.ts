import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from '../../../app-config.service';
import { AppSandbox } from '../../../app.sandbox';
import { User } from '../../models';
import { Sandbox } from '../../sandbox/base.sandbox';

// import { Store }      	     from '@ngrx/store';
// import * as store     	     from '../../store';
// import * as authActions      from '../../store/actions/auth.action';
// import * as settingsActions  from '../../store/actions/settings.action';
@Injectable()
export class LayoutSandbox extends Sandbox {

    // public selectedLang$ = this.appState$.select(store.getSelectedLanguage);
    // public availableLanguages$ = this.appState$.select(store.getAvailableLanguages);
    // public user$ = this.appState$.select(store.getLoggedUser);
    // private loginLoaded$;

    private user = JSON.parse(sessionStorage.getItem('currentUser'));
    public user$ = Observable.of(new User(this.user));
    public selectedLang: string;
    public availableLanguages: Array<any>;

    constructor(
        // protected appState$: Store<store.State>,
        // public translateService: TranslateService,
        private appSandbox: AppSandbox,
        private router: Router,
        private configService: ConfigService
    ) {
        super();
        const localization: any = this.configService.get('localization');
        this.availableLanguages = localization && localization.languages;
    }

    public selectLanguage(lang: any): void {
        // this.appState$.dispatch(new settingsActions.SetLanguageAction(lang.code));
        // this.appState$.dispatch(new settingsActions.SetCultureAction(lang.culture));
        // this.translateService.use(lang.code);
        this.appSandbox.selectLanguage(lang);
    }

    public getCurrentLanguage(): string {
        return this.appSandbox.getCurrentLanguage();
    }

    public logout() {
        // this.appState$.dispatch(new authActions.DoLogoutAction());
        // this.subscribeToLoginChanges();
    }

    // private subscribeToLoginChanges() {
    //     if (this.loginLoaded$) return;

    //     this.loginLoaded$ = this.appState$.select(store.getAuthLoaded)
    //         .subscribe(loaded => {
    //             if (!loaded) this.router.navigate(['/login'])
    //         });
    // }
}
