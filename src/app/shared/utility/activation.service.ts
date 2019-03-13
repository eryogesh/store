import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/async-services/http';
import { User } from '../models/auth/user.model';
import { ConfigService } from '../../app-config.service';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ActivationService extends HttpService {
  private url = this.getBaseUrl();
  public activationUserLink(data: any): Observable<any> {
    const fd = new FormData();
    fd.append('userId', data);
    return this.http.post<any>(this.url + '/activeAccount', fd);
  }
}
