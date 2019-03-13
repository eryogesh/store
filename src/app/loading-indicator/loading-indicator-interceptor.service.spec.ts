import { TestBed, inject } from '@angular/core/testing';

import { LoadingIndicatorInterceptorService } from './loading-indicator-interceptor.service';

describe('LoadingIndicatorInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingIndicatorInterceptorService]
    });
  });

  it('should be created', inject([LoadingIndicatorInterceptorService], (service: LoadingIndicatorInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
