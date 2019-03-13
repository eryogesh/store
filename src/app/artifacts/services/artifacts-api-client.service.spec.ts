import { TestBed, inject } from '@angular/core/testing';

import { ArtifactsApiClientService } from './artifacts-api-client.service';

describe('ArtifactsApiClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtifactsApiClientService]
    });
  });

  it('should be created', inject([ArtifactsApiClientService], (service: ArtifactsApiClientService) => {
    expect(service).toBeTruthy();
  }));
});
