import { ErrorHandler, Injectable } from '@angular/core';

import { ErrorLogService } from '../logging/error-log.service';
import { HttpResponseHandlerService } from '../shared/async-services/http/';

// Global error handler for logging errors
@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
    constructor(private errorLogService: ErrorLogService, private httpResponseHandlerService: HttpResponseHandlerService) {
        // Angular provides a hook for centralized exception handling.
        // constructor ErrorHandler(): ErrorHandler
        super();
    }

    public handleError(error): void {
        this.errorLogService.logError(error);
        this.httpResponseHandlerService.onCatch(error).subscribe();
    }
}
