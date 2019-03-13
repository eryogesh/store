import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, Inject } from '@angular/core';
import {
  APP_BASE_HREF, Location,
  LocationStrategy, PathLocationStrategy
} from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TranslateLoader, TranslateModule, TranslateParser,
  TranslateService
} from 'ng2-translate';
import { ButtonModule } from 'primeng/components/button/button';
import { MessageService } from 'primeng/components/common/messageservice';
import { GrowlModule } from 'primeng/components/growl/growl';
import { MessagesModule } from 'primeng/components/messages/messages';
import { TagInputModule } from 'ngx-chips';
import { MomentModule } from 'ngx-moment';
import { NotificationsService } from 'angular2-notifications';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { DataViewModule } from 'primeng/dataview';
import {
  AccordionModule, DataListModule, CheckboxModule, EditorModule,
  TabViewModule, RatingModule, InputTextareaModule, RadioButtonModule,
  FileUploadModule, OverlayPanelModule, ProgressSpinnerModule,
  ConfirmDialogModule, MenubarModule, DropdownModule, DataGridModule,
  TreeModule, DialogModule, PanelModule, DataScrollerModule
} from 'primeng/primeng';

import { PipesModule } from '../../../shared/pipes/pipes.module';
import { AdminApiClientService } from '../../services/admin-api-client.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '../../../app-config.service';
import { HttpResponseHandlerService } from '../../../shared/async-services/http';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { ErrorLogService } from '../../../logging/error-log.service';
import { UtilityService } from '../../../shared/utility';
import { AppSandbox } from '../../../app.sandbox';
import { AdminSandbox } from '../../services/admin.sandbox';
import { AssetApprovalComponent } from './asset-approval.component';
import { Observable } from 'rxjs';
import { Artifact } from '../../../shared/models';

@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
  transform(value: string): string {
    //Do stuff here, if you want
    return value;
  }
}

class RouterStub {
  navigateByUrl(url: string) {
    return url;
  }
}

class MockConfigService {
  get(key: any) {
    key = "Admin.AssetApproval.NoRecordFound";
    return key;
  }
}
class MockAdminSandbox {
  assetApprovalDetails$: Artifact[] = [];
}
class MockAdmApiClienService {
  getCategories() {
    return { userID: '199' };
  }
  getAllsubCategories() { }
  createCategory() { }
  updateCategoryStatus() { }
  updateSubcategoryStatus() { }
  getUsersToApprove() { }
  getUserRoles() { }
  getUserProfiles() { }
  getEmailUserAccessData() { }
  approveUser() { }
  getAssetsToapprove() { }
  getAssetDetails() { }
  downloadArtifact() { }
  DeleteAsset() { }
  saveApprovedAssets() { }
}
export  const PRIMENG  =  [
  TooltipModule,
  ButtonModule,
  DataScrollerModule,
  DataViewModule,
  PanelModule,
  DialogModule,
  AccordionModule,
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
  MenubarModule,
  DropdownModule,
  DataGridModule,
  MomentModule
];

describe('AssetApprovalComponent :', () => {
  let component: AssetApprovalComponent;
  let fixture: ComponentFixture<AssetApprovalComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssetApprovalComponent, MockPipe],
      providers: [
        Location,
        { provide: Router, useValue: mockRouter },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: AdminApiClientService, useClass: MockAdmApiClienService },
        TranslateModule,
        TranslateService,
        TranslateLoader,
        TranslateParser,
        AdminSandbox,
        HttpClient,
        HttpHandler,
        HttpResponseHandlerService,
        NotificationsService,
        GlobalErrorHandler,
        ErrorLogService,
        UtilityService,
        AppSandbox
      ],

      imports: [FormsModule, ReactiveFormsModule, PRIMENG, PipesModule,],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetApprovalComponent);
    component = fixture.componentInstance;
  });

  it('compnent should create ', () => {
    expect(component).toBeTruthy();
  });

  it('Initialize project information ', inject([AdminSandbox], (adminSandbox) => {
    //const artifact[] = new Artifact();
    const artifact = [{
      approverRemarks: '',
      assetStatusId: '',
      avgRating: 0,
      categoryId: 49,
      categoryName: 'Mobile',
      downloadCount: 0,
      effortsInvested: 0,
      imageUrl: 'Angular.png',
      isActive: 0,
      isFavorite: 0,
      isPublished: 0,
      isReviewed: 0,
      ownerEmailID: 'yogesh.patel@capgemini.com',
      ownerImage: '',
      ownerName: 'Yogesh Patel',
      profileMapping: '',
      projId: 268,
      projectLastUpdate: '2018-06-12 09:20:29.0',
      projectName: 'Angular4-Social-Login-Component',
      projectPath: '',
      projectType: '',
      size: 0,
      subCategoryId: 89,
      subCategoryName: 'Solutions',
      tags: '',
      userDownloaded: 0,
      userID: 166,
      versionName: '4',
      versionNo: 2
    }];
    adminSandbox.assetApprovalDetails$ = Observable.of(artifact );
    const assetApprovals = artifact ;
    let totalRecords = assetApprovals.length;
    component.ngOnInit();
    expect(assetApprovals.length).toEqual(1);
    expect(assetApprovals[0].projId).toEqual(268);
  }));

  // it('asset language translate ', () => {
  //   component.
  // });

  it('Search for User ', inject([AdminSandbox], (adminSandbox) => {
    //const artifact[] = new Artifact();
    const artifact = [{
      approverRemarks: '',
      assetStatusId: '',
      avgRating: 0,
      categoryId: 49,
      categoryName: 'Mobile',
      downloadCount: 0,
      effortsInvested: 0,
      imageUrl: 'Angular.png',
      isActive: 0,
      isFavorite: 0,
      isPublished: 0,
      isReviewed: 0,
      ownerEmailID: 'yogesh.patel@capgemini.com',
      ownerImage: '',
      ownerName: 'Yogesh Patel',
      profileMapping: '',
      projId: 268,
      projectLastUpdate: '2018-06-12 09:20:29.0',
      projectName: 'Angular4-Social-Login-Component',
      projectPath: '',
      projectType: '',
      size: 0,
      subCategoryId: 89,
      subCategoryName: 'Solutions',
      tags: '',
      userDownloaded: 0,
      userID: 166,
      versionName: '4',
      versionNo: 2
    }];
    adminSandbox.assetApprovalDetails$ = Observable.of(artifact );
    let emailAddress = 'yogesh';
    let isSearchFound = false;
    let successMessage = '';
    let noRecordFound = 'No record found';
    if (emailAddress) {
      const tempArray = new Array();
      let assetApprovals = artifact ;
      for (let loop = 0, len = assetApprovals.length; loop < len; ++loop) {
        if (assetApprovals[loop].ownerName && (assetApprovals[loop].ownerName.toUpperCase() === emailAddress.toUpperCase()
          || assetApprovals[loop].ownerName.toUpperCase().indexOf(emailAddress.toUpperCase()) !== -1)) {
          tempArray.push(assetApprovals[loop]);
          isSearchFound = true;
        } else if (assetApprovals[loop].categoryName.toUpperCase() === emailAddress.toUpperCase()
          || assetApprovals[loop].categoryName.toUpperCase().indexOf(emailAddress.toUpperCase()) !== -1) {
          tempArray.push(assetApprovals[loop]);

        } else if (assetApprovals[loop].subCategoryName.toUpperCase() === emailAddress.toUpperCase()
          || assetApprovals[loop].subCategoryName.toUpperCase().indexOf(emailAddress.toUpperCase()) !== -1) {
          tempArray.push(assetApprovals[loop]);

        }
      }
      let assetsClone = Object.assign([], assetApprovals);

      if (tempArray.length === 0) {
        isSearchFound = false;
      }
      if (isSearchFound === false) {
        assetApprovals = [];
        successMessage = noRecordFound;
      } else {
        assetApprovals = tempArray;
      }
    }
    expect(isSearchFound).toBe(true);
  }));

  it('check for enter key press ', () => {
    fixture = TestBed.createComponent(AssetApprovalComponent);
    component = fixture.componentInstance;
    //let submitElement = fixture.debugElement.query(By.css('.emailSearch'));
    //let searchElement = fixture.debugElement.query(By.css('input[name=owner]'));
    //searchElement.nativeElement.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }))
    //const keyCode = event.which || event.keyCode;
    const eventObj = { keyCode: 13 };
    component.emailAddress = 'yogesh';
    component.ifEnterPressed(eventObj);
    expect(eventObj.keyCode).toEqual(13);
  });

  it('reset searchUser data ', () => {
    let emailAddress = null;
    let assetApprovals = {};
    let isSearchFound = false;
    component.resetSearch();
    expect(component.resetSearch()).toBeUndefined();
  });

  it('show project details ', () => {
    // fixture = TestBed.createComponent(AssetApprovalComponent);
    // component = fixture.componentInstance;
    //let navigateSpy = spyOn((<any>component).router, 'navigate');
    let projId = '268';
    let userID = 166;
    let isPublished = 0;
    expect(component.viewProjectDetails(projId, userID, isPublished)).toBeUndefined();
    //mockRouter.navigate = jasmine.createSpy().and.returnValue('./admin/view-asset-approval/268');
    //expect(navigateSpy).toHaveBeenCalledWith(['./admin/view-asset-approval/268']);
  });

});
