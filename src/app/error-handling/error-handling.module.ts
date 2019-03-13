import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ErrorLogService } from '../logging/error-log.service';
import { LoggingModule } from '../logging/logging.module';

@NgModule({
  imports: [
    CommonModule,
    LoggingModule
  ],
  declarations: [],
  providers: [ErrorLogService]
})
export class ErrorHandlingModule { }
