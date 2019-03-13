import { TestBed, inject } from '@angular/core/testing';

import { ArtifactsService } from './artifacts.service';

describe('ArtifactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtifactsService]
    });
  });

  it('should be created', inject([ArtifactsService], (service: ArtifactsService) => {
    expect(service).toBeTruthy();
  }));
});
