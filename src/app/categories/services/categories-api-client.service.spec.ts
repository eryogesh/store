import { TestBed, inject } from '@angular/core/testing';

import { CategoriesApiClientService } from './categories-api-client.service';

describe('CategoriesApiClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesApiClientService]
    });
  });

  it('should be created', inject([CategoriesApiClientService], (service: CategoriesApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
