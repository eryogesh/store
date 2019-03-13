import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  TranslateModule,
  TranslateLoader,
  TranslateStaticLoader
} from 'ng2-translate';
import { TranslateService } from 'ng2-translate';

import { ConfigService } from './app-config.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppSandbox } from './app.sandbox';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ErrorHandlingModule } from './error-handling/error-handling.module';
import { GlobalErrorHandler } from './error-handling/global-error-handler';
import { LoadingIndicatorModule } from './loading-indicator/loading-indicator.module';
import { ErrorLogService } from './logging/error-log.service';
import { LoggingModule } from './logging/logging.module';
import { HttpServiceModule } from './shared/async-services/http';
import { ComponentsModule } from './shared/components/components.module';
import { ContainersModule } from './shared/containers/containers.module';
import { AuthGuard } from './shared/guards/auth.guard';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';
import { InfiniteScrollModule } from './shared/infinite-scroll/infinite-scroll';
import { UtilityModule } from './shared/utility/utility.module';
import { YammerModule } from './yammer/yammer.module';
import { TagInputModule } from 'ngx-chips';
import {GrowlModule} from 'primeng/growl';


/**
 * Calling functions or calling new is not supported in metadata when using AoT.
 * The work-around is to introduce an exported function.
 *
 * The reason for this limitation is that the AoT compiler needs to generate the code that calls the factory
 * and there is no way to import a lambda from a module, you can only import an exported symbol.
 */
export function configServiceFactory(config: ConfigService) {
  return () => config.load();
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // Third party modules
    TranslateModule.forRoot(),
    SimpleNotificationsModule.forRoot(),

    // App custom dependencies
    HttpServiceModule.forRoot(),
    UtilityModule.forRoot(),
    InfiniteScrollModule,
    LoadingIndicatorModule,
    YammerModule,

    LoggingModule,
    ErrorHandlingModule,
    AppRoutingModule,
    CategoriesModule,
    ContainersModule,
    ComponentsModule,
    AuthModule,
    TagInputModule,
    GrowlModule
  ],
  providers: [
    AppSandbox,
    AuthGuard,
    CanDeactivateGuard,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigService],
      multi: true
    },
    ErrorLogService,
    GlobalErrorHandler
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
