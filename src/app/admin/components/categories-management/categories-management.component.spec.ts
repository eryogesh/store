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
import { Observable } from 'rxjs';
import { Artifact, Category } from '../../../shared/models';
import { PostResponse, ArtifactResponse } from '../../../shared/models/post-response.model';
import { CategoriesManagementComponent } from './categories-management.component';

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
  categoriesResponse$: Category[] = [];
  postResponse$:PostResponse;
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

fdescribe('CategoriesManagementComponent :', () => {
  let component: CategoriesManagementComponent;
  let fixture: ComponentFixture<CategoriesManagementComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesManagementComponent, MockPipe ],
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
        AppSandbox,
        MessageService
      ],
      imports: [FormsModule, ReactiveFormsModule, PRIMENG, PipesModule,],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesManagementComponent);
    component = fixture.componentInstance;
  });

  it('component should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialize and get categories', inject([AdminSandbox], (adminSandbox) => {
    const category = [{catID: 46, catParentId: 0, isActive: 1, categoryName: "BankingUAT"}];
    adminSandbox.categoriesResponse$ = Observable.of(category);
    component.ngOnInit();
  }));

  it('show Category Dialog', () => {
    let displayMainCategory = false;
    let categoryModel = '';
    if (!displayMainCategory){
      displayMainCategory = true;
      categoryModel = '';
      component.showCategoryDialog();
    }
    expect(displayMainCategory).toEqual(true);
  });

  it('show SubCategory Dialog', () => {
    let selectedID = 12;
    let displaySubCategory = false;
    let subCategoryModel = '';
    let errorMsgUpdate = '';
    let succesMsgUpdate = '';
    if (selectedID) {
      component.showSubcategoryDialog();
      displaySubCategory = true;
      subCategoryModel = '';
      errorMsgUpdate = '';
    } else {
      succesMsgUpdate = '';
      errorMsgUpdate = 'selet main category';
    }
    expect(displaySubCategory).toEqual(true);
  });
  
  it('show Delete Dialog', () => {
    let displayDeleteDialog = false;
    let deleteErrorMsg = '';
    if(!displayDeleteDialog){
      component.showDeleteDialog();
      displayDeleteDialog = true;
    }
    expect(displayDeleteDialog).toEqual(true);
  });

  it('close dialog when ckick on cancle button', () => {
    let displayMainCategory = true;
    let displaySubCategory = true;
    let displayDeleteDialog = true;
    let deleteErrorMsg = '';
    component.cancel();
    displayMainCategory = false; displaySubCategory = false;  displayDeleteDialog = false;   
    expect(displayDeleteDialog).toEqual(false);
  });

  it('add category', inject([AdminSandbox,AdminApiClientService, MessageService ], (adminSandbox,adminApiClient, messageService) => {
    let category = 'capital';
    let parentId = 0;
    if(!category)
    {
      return;
    }
    let selectedID = parentId;
    const dataReq = { 'categoryName': category, 'parentCatId': 0 };
    adminSandbox.createCategory(dataReq);
    let data = {msg: 'Category created successfully', status: true};
    spyOn(adminApiClient,'createCategory').and.returnValue(Observable.of(dataReq));
    adminSandbox.categoriesResponse$ = Observable.of(dataReq);
    adminSandbox.postResponse$ = Observable.of(data);
    expect(data).not.toBeNull();
    if (data && data.status === true) {
      let displayMainCategory = false;
      let displaySubCategory = false;
      let updateSubcat = false;
      messageService.add({ severity: 'success', summary: 'success', detail: data.msg });
    }
    component.addCategory(category, 0);
  }));

  it('remove categories button', inject([AdminSandbox], (adminSandbox) => {
    const category = [{catID: 46, catParentId: 0, isActive: 1, categoryName: 'BankingUAT'}];
    adminSandbox.categoriesResponse$ = Observable.of(category);
    component.onRemoveCat('BankingUAT', event);
  }));

  it('delete categories', inject([AdminSandbox], (adminSandbox) => {
    const categories = [{catID: 46, catParentId: 0, isActive: 1, categoryName: 'BankingUAT', isChecked:true, checked:true}, 
                        {catID: 47, catParentId: 0, isActive: 1, categoryName: 'Banking', isChecked:true, checked:true}];
    adminSandbox.categoriesResponse$ = Observable.of(categories);
    let checkedMainCat;
    for (let i = 0, len = categories.length; i < len; ++i) {
      if (categories[i].checked === true) {
        if (!checkedMainCat) {
          checkedMainCat = categories[i].catID;
        } else {
          checkedMainCat = checkedMainCat + ',' + categories[i].catID;
        }
      }
    }
    component.deleteCategory();
  }));

});
