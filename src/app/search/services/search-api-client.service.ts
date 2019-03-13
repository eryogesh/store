import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpService } from '../../shared/async-services/http';
import { ArtifactSearchResponse } from '../../shared/models/post-response.model';

@Injectable()
export class SearchApiClientService extends HttpService {
  private url = this.getBaseUrl();
  public downloadUrl = this.getDownloadUrl();

  public sessionData(): FormData {
    const session = JSON.parse(sessionStorage.getItem('sessionData'));
    const formData = new FormData();
    if (session) {
      formData.append('userId', session.userId);
      formData.append('sessionAuthKey', session.sessionId);
      formData.append('uniqueId', session.uniqueId);
    } else {
      formData.append('userId', '-1');
      formData.append('sessionAuthKey', undefined);
      formData.append('uniqueId', undefined);
    }
    return formData;
  }

  /**
   * Retrieves search items
   */
  public searchAsset(data): Observable<ArtifactSearchResponse> {
    const fd = new FormData(); // this.sessionData();
    fd.append('assetId', '-1');
    fd.append('searchString', data.searchString);
    fd.append('profileMapping', data.profileMapping);
    fd.append('userId', '-1');
    fd.append('sessionAuthKey', data.sessionAuthKey);
    fd.append('uniqueId', data.uniqueId);
    return this.http.post<ArtifactSearchResponse>(this.url + '/searchProjectsbyName', fd);
  }

  public searchAssetWighPaging(data): Observable<ArtifactSearchResponse> {
    const fd = this.sessionData();
    fd.append('assetId', '-1');
    fd.append('searchString', data.searchString);
    fd.append('profileMapping', data.profileMapping);
    fd.append('startIndx', data.startIndx);
    fd.append('pageSize', data.pageSize);
    return this.http.post<ArtifactSearchResponse>(this.url + '/searchProjectsbyNameWithPaging', fd);
  }
}
