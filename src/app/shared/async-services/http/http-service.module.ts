import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './http.service';
import { HttpResponseHandlerService } from './http-response-handler.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class HttpServiceModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HttpServiceModule,

      providers: [
        HttpService,
        HttpResponseHandlerService
      ]
    };
  }
}
