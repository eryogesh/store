import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NotificationsService } from "angular2-notifications";
import { DataViewModule } from 'primeng/dataview';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateLoader, TranslateModule, TranslateParser, TranslateService } from 'ng2-translate';

import { ArtifactRelatedComponent } from './artifact-related.component';
import { ArtifactsSandbox } from "../../services/artifacts.sandbox";
import { ArtifactsApiClientService } from "../../services/artifacts-api-client.service";
import { ConfigService } from "../../../app-config.service";
import { HttpResponseHandlerService } from "../../../shared/async-services/http/http-response-handler.service";
import { CategoriesApiClientService } from "../../../categories/services/categories-api-client.service";
import { GlobalErrorHandler } from "../../../error-handling/global-error-handler";
import { ErrorLogService } from "../../../logging/error-log.service";

import { Observable } from "rxjs/Observable";
import { UtilityService } from "../../../shared/utility/utility.service";
import { ArtifactSearchResponse } from "../../../shared/models/post-response.model";
import { Artifact, UserDetails, UserAccess } from "../../../shared/models/index";


@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

@Pipe({ name: 'safeUrl' })
class MockSafeUrl implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

export class MockConfigService {
  get(key: any) {
    return key;
  }
}

export class MockUtilityService {
  private sessionData: Storage;
  private _mockData: any = []
  getLoggedUser(): Observable<any> {
    return Observable.of(this._mockData);
  }

  getSessionData(): Observable<Storage> {

    return Observable.of(this.sessionData);
  }


}


export class MockArtifactsSandbox {
  public relatedArtifact$: Observable<ArtifactSearchResponse>;
  public getRelatedArtifact(form_data: object): void {
    const artifactSearchResponse = new ArtifactSearchResponse();
    this.relatedArtifact$ = Observable.of(artifactSearchResponse);
  }
}


fdescribe('ArtifactRelatedComponent', () => {
  let component: ArtifactRelatedComponent;
  let fixture: ComponentFixture<ArtifactRelatedComponent>;
  let debugElement: DebugElement;
  let utilityService: UtilityService;
  let sessionSpy;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArtifactRelatedComponent,
        MockPipe,
        MockSafeUrl
      ],
      imports: [
        DataViewModule,
        TooltipModule,
        HttpClientModule

      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: UtilityService, useClass: MockUtilityService },
        HttpResponseHandlerService,
        NotificationsService,
        CategoriesApiClientService,
        GlobalErrorHandler,
        ErrorLogService,
        ArtifactsSandbox,
        ArtifactsApiClientService,
        TranslateModule,
        TranslateService,
        TranslateLoader,
        TranslateParser,
        HttpClient
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactRelatedComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should check whether ArtifactRelatedComponent methods exist', () => {
    expect(component.copyToClipboard).toBeDefined();
    expect(component.yammerWindowPopup).toBeDefined();
    expect(component.relatedArtifactDetailsNavigation).toBeDefined();

  });

  it('should call copyToClipboard method', () => {
    component.copyToClipboard(true);
    expect(component.copyArtifactUrl).toBeDefined;
    expect(component.copyArtifactUrlPopup).toBe(true);

    component.copyToClipboard(false);
    expect(component.copyArtifactUrl).toBeDefined;
    expect(component.copyArtifactUrlPopup).toBe(false);
  });


  it('should call relatedArtifactDetailsNavigation method',
    inject([ArtifactsSandbox], (artifactsSandbox) => {
      const project = { projectName: "Sample Test 1", projId: "1" }
      const artifactData: Artifact = {
        subCategoryName: "Mobile",
        projId: 1,
        approverRemarks: "Ok",
        projectType: "Mobile",
        description: "This is a sample project",
        isActive: 1,
        versionName: "1.0",
        categoryName: "Mobile",
        userID: 1,
        features: "Sample features",
        userDownloaded: 2,
        ownerName: "Tom",
        ownerEmailID: "Tom@capgemini.com",
        imageUrl: "",
        versionNo: 1,
        avgRating: 4,
        viewCount: 21,
        assetStatusId: "",
        profileMapping: "",
        isPublished: 1,
        projectLastUpdate: "22-01-2018",
        projectPath: "",
        isReviewed: 1,
        subCategoryId: 1,
        tags: "",
        effortsInvested: 2,
        size: 6,
        projectName: "",
        categoryId: 1,
        downloadCount: 10,
        isFavorite: 1,
        uploadType: "",
        assetSupportFiles: null,
      };
      component.artifactData = artifactData;
      component.relatedArtifacts = new ArtifactSearchResponse();
      const userAccess = {
        profileId: "",
        userRole: "",
        roleId: "",
        userProfile: "",
        userId: "",
      }
      const userDetails = {
        shortID: "",
        lastLogin: "",
        emailID: "",
        profileImage: "",
        isActive: "",
        categoryPrefs: "",
        userID: 1,
        userAccess: userAccess,
        name: "",
        isApproved: 1,
        designation: "",
      };
      component.userDetails = userDetails;
      const artifactSearchResponse = {
        categories: [],
        project_results: [],
        totalCount: 1
      }
      component.artifactsSandbox.relatedArtifact$ = Observable.of(artifactSearchResponse);
      spyOn(artifactsSandbox, 'getRelatedArtifact').and.returnValue(new MockArtifactsSandbox());
      component.relatedArtifactDetailsNavigation(project);
    }));


  it('should call yammerWindowPopup method', () => {
    component.yammerWindowPopup("Owner1", "Test Project");
});
});
