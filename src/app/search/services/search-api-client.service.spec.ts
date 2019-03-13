import { TestBed, inject } from '@angular/core/testing';

import { SearchApiClientService } from './search-api-client.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../../app-config.service';
import { HttpResponseHandlerService } from '../../shared/async-services/http';
import { Router } from '@angular/router';
import { TranslateService, TranslateLoader, TranslateParser } from 'ng2-translate';
import { NotificationsService } from 'angular2-notifications';

class MockConfigService {
  get(key: any) {
    return key;
  }
}

fdescribe('SearchApiClientService', () => {
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchApiClientService, HttpClient, HttpHandler, { provide: ConfigService, useClass: MockConfigService },
        HttpResponseHandlerService, { provide: Router, useValue: mockRouter }, TranslateService, TranslateLoader,
        TranslateParser, NotificationsService]
    });
  });

  it('should be created', inject([SearchApiClientService], (service: SearchApiClientService) => {
    expect(service).toBeTruthy();
  }));
  it('No session data should  be checked', inject([SearchApiClientService], (service: SearchApiClientService) => {
    const sessionData = {
      userId: '166',
      sessionId: 'a6n0e5g2iumi1nbtfuhc8bmkf5',
      uniqueId: '490a69fb-3eea-4b4b-8232-ed4cb5822fff'
    };
    const formData = new FormData();
    service.sessionData();
  }));
  it('sessionData be created', inject([SearchApiClientService], (service: SearchApiClientService) => {
    const sessionData = {
      userId: '166',
      sessionId: 'a6n0e5g2iumi1nbtfuhc8bmkf5',
      uniqueId: '490a69fb-3eea-4b4b-8232-ed4cb5822fff'
    };
    window.sessionStorage.setItem(
      'sessionData',
      JSON.stringify(sessionData)
    );
    const session = JSON.parse(sessionStorage.getItem('sessionData'));
    const formData = new FormData();
    service.sessionData();
  }));
  it('searchAsset should be called', inject([SearchApiClientService], (service: SearchApiClientService) => {
    const data = {
      profileMapping: '',
      searchString: 'bank', sessionAuthKey: '', uniqueId: '', userId: -1
    };
    service.searchAsset(data);
  }));
  it('searchAssetWighPaging should be called', inject([SearchApiClientService], (service: SearchApiClientService) => {
    const data = {
      pageSize: 12, profileMapping: '',
      searchString: 'bank', sessionAuthKey: '', startIndx: 0, uniqueId: '', userId: -1
    };
    const fd = service.sessionData();
    service.searchAssetWighPaging(data);
  }));
});
