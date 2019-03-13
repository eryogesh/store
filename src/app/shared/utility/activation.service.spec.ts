import { TestBed, inject } from '@angular/core/testing';

import { ActivationService } from './activation.service';

describe('ActivationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivationService]
    });
  });

  it('should be created', inject([ActivationService], (service: ActivationService) => {
    expect(service).toBeTruthy();
  }));
});
