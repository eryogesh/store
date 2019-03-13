import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LoadingIndicatorService } from './loading-indicator.service';

@Injectable()
export class LoadingIndicatorInterceptorService implements HttpInterceptor {

  constructor(private loadingIndicatorService: LoadingIndicatorService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // emit onStarted event before request execution
    this.loadingIndicatorService.onStarted(req);

    return next
      .handle(req)
      // emit onFinished event after request execution
      .finally(() => this.loadingIndicatorService.onFinished(req));
  }

}
