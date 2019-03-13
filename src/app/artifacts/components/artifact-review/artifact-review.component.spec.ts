import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateParser, TranslateService } from 'ng2-translate';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ArtifactReviewComponent } from './artifact-review.component';
import { DataGridModule } from "primeng/components/datagrid/datagrid";
import { TooltipModule } from "primeng/tooltip";
import { RatingModule } from "primeng/rating";
import { DialogModule } from "primeng/dialog";
import { DataViewModule } from "primeng/dataview";
import { PanelModule } from "primeng/panel";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from "primeng/button";
import { AccordionModule } from 'primeng/accordion';
import { DataScrollerModule } from "primeng/datascroller";
import { MomentModule } from "ngx-moment";
import { DropdownModule } from "primeng/dropdown";
import { MenubarModule, ConfirmDialogModule } from "primeng/primeng";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextareaModule } from "primeng/components/inputtextarea/inputtextarea";
import { GrowlModule } from "primeng/growl";
import { TabViewModule } from "primeng/components/tabview/tabview";
import { EditorModule } from "primeng/editor";
import { CheckboxModule } from "primeng/checkbox";
import { DataListModule } from "primeng/datalist";
import { FormsModule } from '@angular/forms';
import { ArtifactsSandbox } from "../../services/artifacts.sandbox";
import { ArtifactsApiClientService } from "../../services/artifacts-api-client.service";
import { HttpClientModule } from "@angular/common/http";
import { ConfigService } from "../../../app-config.service";
import { HttpResponseHandlerService } from "../../../shared/async-services/http/http-response-handler.service";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";
import { CategoriesApiClientService } from "../../../categories/services/categories-api-client.service";
import { GlobalErrorHandler } from "../../../error-handling/global-error-handler";
import { ErrorLogService } from "../../../logging/error-log.service";
import { UtilityService } from "../../../shared/utility/utility.service";
import { MessageService } from "primeng/components/common/messageservice";
import { AppSandbox } from "../../../app.sandbox";
import { Artifact, ArtifactReview } from "../../../shared/models/index";
import { Observable } from "rxjs/Observable";
import { PostResponse } from "../../../shared/models/post-response.model";


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

export class MockAppSandbox extends AppSandbox {

}

class MockArtifactsSandbox {
  public artifactReviewsList$: Observable<ArtifactReview[]>;
  public artifactReview(projId: number): void {
    /* const varartifactReview : ArtifactReview[];
     this.artifactReviewsList$ = Observable.of(new ArtifactReview[]);*/
  }

  public postProjectReview(form_data: object): void {
    //this.artifactReviewPost$ = this.artifactsApiClient.postProjectReview(form_data);
  }
}

class MockTranslateService extends TranslateService {
  public get(key: string | Array<string>, interpolateParams?: Object): Observable<String | any> {
    console.log("Key " + key);
    if (key == 'artifact-details.Message.userNotAuthMsg') {
      return Observable.of("User is not authorised to view this Artifact");
    } else if (key == 'artifact-details.Message.ProjectInfoNot') {
      return Observable.of("Project information not found");
    } else if (key = 'artifact-details.Message.Success') {
      return Observable.of("Success");
    } else if (key = 'artifact-details.Message.Error') {
      return Observable.of("Error Message");
    } else if (key = 'artifact-details.Message.ArtifactUpdatedMsg') {
      return Observable.of("Artifact Updated");
    }
  }
}
fdescribe('ArtifactReviewComponent', () => {
  let component: ArtifactReviewComponent;
  let fixture: ComponentFixture<ArtifactReviewComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ArtifactReviewComponent,
        MockPipe,
        MockSafeUrl
      ],
      imports: [
        DataGridModule,
        TooltipModule,
        DataViewModule,
        PanelModule,
        DialogModule,
        ButtonModule,
        AccordionModule,
        DataScrollerModule,
        DataListModule,
        CheckboxModule,
        EditorModule,
        TabViewModule,
        GrowlModule,
        RatingModule,
        InputTextareaModule,
        TreeModule,
        RadioButtonModule,
        FileUploadModule,
        OverlayPanelModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        TooltipModule,
        MenubarModule,
        DropdownModule,
        DataGridModule,
        MomentModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        { provide: Router, useValue: mockRouter },
        { provide: AppSandbox, useClass: MockAppSandbox },
        { provide: TranslateService, useClass: MockTranslateService },
        HttpResponseHandlerService,
        NotificationsService,
        CategoriesApiClientService,
        TranslateModule,
        TranslateService,
        TranslateLoader,
        TranslateParser,
        ArtifactsSandbox,
        ArtifactsApiClientService,
        GlobalErrorHandler,
        ErrorLogService,
        UtilityService,
        MessageService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();

  }));

  beforeEach(inject([ArtifactsSandbox], (artifactsSandbox) => {
    fixture = TestBed.createComponent(ArtifactReviewComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
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
    const postResponse = new PostResponse();
    const artifactReview = [{
      createdDate: '',
      userImage: '',
      rating: 3,
      userName: '',
      userId: 101,
      projectID: 123,
      reviewId: 12,
      reviewText: '',
      userEmailID: "Tom@capgemini.com"
    }];
    component.artifactsSandbox.artifactReviewPost$ = Observable.of(postResponse);
    spyOn(artifactsSandbox, 'postProjectReview').and.returnValue(new MockArtifactsSandbox());
    spyOn(artifactsSandbox, 'artifactReview').and.returnValue(new MockArtifactsSandbox());
    component.artifactsSandbox.artifactReviewsList$ = Observable.of(artifactReview);

    const session = {
      userId: 101,
      sessionId: "1",
      uniqueId: "123xyz"
    }
    component.session = session;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cal ngOnInit', inject([ArtifactsSandbox], (artifactsSandbox) => {

    component.ngOnInit();
  }));

  it('should call postProjectReviews', inject([ArtifactsSandbox], (artifactsSandbox) => {
    const review: ArtifactReview = {
      createdDate: '',
      userImage: '',
      rating: 3,
      userName: '',
      userId: 101,
      projectID: 123,
      reviewId: 12,
      reviewText: '',
      userEmailID: "Tom@capgemini.com"
    }
    component.postProjectReviews(review);
  }));
});
