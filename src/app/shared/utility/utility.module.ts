import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityService } from './utility.service';
import { ValidationService } from './validation.service';
import {ActivationService} from './activation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class UtilityModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UtilityModule,

      providers: [
        UtilityService,
        ValidationService, ActivationService
      ]
    };
  }
}
