import { Injectable } from '@angular/core';
import { HttpService, Adapter, Path, POST } from '../../shared/async-services/http';
import { CategoriesService } from './categories.service';
import { Observable } from 'rxjs/Observable';
import { CategoriesForUpload, Category, CategoriesData } from '../../shared/models';

@Injectable()
export class CategoriesApiClientService extends HttpService {
  private url = this.getBaseUrl();

  public sessionData() {
    const session = JSON.parse(sessionStorage.getItem('sessionData'));
    const formData = new FormData();
    if (session) {
      formData.append('userId', session.userId);
      formData.append('sessionAuthKey', session.sessionId);
      formData.append('uniqueId', session.uniqueId);
      return formData;
    }
  }

  /**
   * Retrieves all categories
   */
  // @POST('/category')
  // @Adapter(CategoriesService.gridAdapter)
  public getCategories(): Observable<Category[]> {
    return this.http.post<Category[]>(this.url + '/getLandingScreenCategories', { isArray: true });
  }


  /**
   * Retrieves all categories
   */
  // @POST('/category')
  // @Adapter(CategoriesService.gridAdapter)
  public showallCategories(): Observable<Category[]> {
    const body = new FormData();
    body.append('userId', '-1');
    body.append('sessionAuthKey', '');
    body.append('uniqueId', '');
    return this.http.post<Category[]>(this.getBaseUrl() + '/showCategoriesForFilter', body);
  }

  public getCategoriesForUpload(parentCatId: number): Observable<CategoriesForUpload> {
    const fd = this.sessionData();
    fd.append('parentCatId', parentCatId.toString());
    fd.append('isActive', '1');

    return this.http.post<CategoriesForUpload>(this.url + '/getCategories', fd);
  }

  public getCategoriesData(): Observable<CategoriesData> {
    return this.http.get<CategoriesData>(this.url + '/getCapstoreDetails');
  }
  /**
   * Retrieves category details by a given id
   *
   * @param id
   */
  @POST('/category/{id}')
  @Adapter(CategoriesService.categoryDetailsAdapter)
  public getCategoryDetails(@Path('id') id: number): Observable<any> { return null; }

}
