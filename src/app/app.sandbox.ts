import { Injectable } from '@angular/core';
import { Sandbox } from './shared/sandbox/base.sandbox';
// import { Store } from '@ngrx/store';
// import * as store from './shared/store';
// import * as settingsActions from './shared/store/actions/settings.action';
import { TranslateService } from 'ng2-translate';
import { ConfigService } from './app-config.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Artifact } from './shared/models';
import { SearchApiClientService } from './search/services/search-api-client.service';

@Injectable()
export class AppSandbox extends Sandbox {
    public searchSubject: BehaviorSubject<string>;
    public searchText$: Observable<string>;

    constructor(// protected appState$: Store<store.State>,
        public translate: TranslateService,
        private configService: ConfigService) {
        super();
        this.searchSubject = new BehaviorSubject<string>('');
        this.searchText$ = this.searchSubject.asObservable();
    }

    /**
     * Sets up default language for the application. Uses browser default language.
     */
    public setupLanguage(): void {
        const localization: any = this.configService.get('localization');
        const languages: Array<string> = localization.languages.map(lang => lang.code);
        const browserLang: string = this.translate.getBrowserLang();

        this.translate.addLangs(languages);
        this.translate.setDefaultLang(localization.defaultLanguage);

        const selectedLang = browserLang.match(/en|hr/) ? browserLang : localization.defaultLanguage;
        const selectedCulture = localization.languages.filter(lang => lang.code === selectedLang)[0].culture;

        this.translate.use(selectedLang);
        // this.appState$.dispatch(new settingsActions.SetLanguageAction(selectedLang));
        // this.appState$.dispatch(new settingsActions.SetCultureAction(selectedCulture));
    }

    public selectLanguage(lang: any): void {
        // this.appState$.dispatch(new settingsActions.SetLanguageAction(lang.code));
        // this.appState$.dispatch(new settingsActions.SetCultureAction(lang.culture));
        this.translate.use(lang.code);
    }

    public getCurrentLanguage(): string {
        return this.translate.currentLang;
    }

    /**
     * Returns global notification options
     */
    public getNotificationOptions(): any {
        return this.configService.get('notifications').options;
    }
}
