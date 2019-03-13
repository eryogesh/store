import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingIndicatorService } from './loading-indicator.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingIndicatorInterceptorService } from './loading-indicator-interceptor.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    LoadingIndicatorService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (service: LoadingIndicatorService) => new LoadingIndicatorInterceptorService(service),
      multi: true,
      deps: [LoadingIndicatorService]
    }]
})
export class LoadingIndicatorModule { }
