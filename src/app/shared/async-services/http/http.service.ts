import { Injectable } from '@angular/core';
import {
  Request,
  RequestMethod,
  Response
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpAdapter } from './http.adapter';
import {
  methodBuilder,
  paramBuilder
} from './utils.service';
import { HttpClient } from '@angular/common/http';
import { HttpResponseHandlerService } from './http-response-handler.service';
import { ConfigService } from '../../../app-config.service';

/**
 * Supported @Produces media types
 */
export enum MediaType {
  JSON,
  FORM_DATA
}

@Injectable()
export class HttpService {

  public constructor(
    protected http: HttpClient,
    protected configService: ConfigService,
    protected responseHandler: HttpResponseHandlerService) {
  }

  protected getBaseUrl(): string {
    //console.log("this.configService.get('api').baseUrl: " + this.configService.get('api').baseUrl);
     return this.configService.get('api').baseUrl;
    // return "https://capstore.fs.capgemini.com/capserviceorm/userservices/";
  }

  protected getEnvUrl(): string {    
    return this.configService.get('api').envUrl;
   // return "https://capstore.fs.capgemini.com/capserviceorm/userservices/";
 }

  protected getDownloadUrl(): string {
    return this.configService.get('api').downloadUrl;
    // return "http://capstore.fs.capgemini.com:8080/";
  }
  protected getDefaultHeaders(): Object {
    return null;
  }

  /**
  * Request Interceptor
  *
  * @method requestInterceptor
  * @param {Request} req - request object
  */
  protected requestInterceptor(req: Request) { }

  /**
  * Response Interceptor
  *
  * @method responseInterceptor
  * @param {Response} observableRes - response object
  * @returns {Response} res - transformed response object
  */
  protected responseInterceptor(observableRes: Observable<any>, adapterFn?: Function): any {
    return observableRes
      .subscribe(res => HttpAdapter.baseAdapter(res, adapterFn),
        (error) => this.responseHandler.onCatch(error));

  }
}
