import { TestBed, inject } from '@angular/core/testing';

import { AuthApiClientService } from './auth-api-client.service';

describe('AuthApiClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiClientService]
    });
  });

  it('should be created', inject([AuthApiClientService], (service: AuthApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
