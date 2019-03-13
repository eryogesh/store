import { TestBed, inject } from '@angular/core/testing';

import { AdminApiClientService } from './admin-api-client.service';

describe('AdminApiClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminApiClientService]
    });
  });

  it('should be created', inject([AdminApiClientService], (service: AdminApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
