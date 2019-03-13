import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorLogService {

  constructor() { }

  // Log error method
  logError(error: any) {
    // Returns a date converted to a string using Universal Coordinated Time (UTC).
    const date = new Date().toUTCString();

    if (error instanceof HttpErrorResponse) {
      // The response body may contain clues as to what went wrong,
      console.error(date, 'There was an HTTP error.', error.message, 'Status code:',
        (<HttpErrorResponse>error).status);
    } else if (error instanceof TypeError) {
      console.error(date, 'There was a Type error.', error.message, error.stack);
    } else if (error instanceof Error) {
      console.error(date, 'There was a general error.', error.message, error.stack);
    } else if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(date, 'There was a general error.', error.message);
    } else {
      console.error(date, 'Nobody threw an Error but something happened!', error.message, error.stack);
    }
  }

}
