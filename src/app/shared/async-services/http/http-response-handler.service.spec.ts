import { TestBed, inject } from '@angular/core/testing';

import { HttpResponseHandlerService } from './http-response-handler.service';

describe('HttpResponseHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpResponseHandlerService]
    });
  });

  it('should be created', inject([HttpResponseHandlerService], (service: HttpResponseHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
