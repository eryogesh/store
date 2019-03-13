import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { NgxEditorModule } from 'ngx-editor';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/components/common/messageservice';
import { DataListModule } from 'primeng/datalist';
import { DataScrollerModule } from 'primeng/datascroller';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { GrowlModule } from 'primeng/growl';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { DataTableModule, InputTextareaModule, TabViewModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';

import { ComponentsModule } from '../shared/components/components.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AssetApprovalComponent } from './components/asset-approval/asset-approval.component';
import { CategoriesManagementComponent } from './components/categories-management/categories-management.component';
import { UserAccessComponent } from './components/user-access/user-access.component';
import { ViewAssetApprovalComponent } from './components/view-asset-approval/view-asset-approval.component';
import { AdminApiClientService } from './services/admin-api-client.service';
import { AdminSandbox } from './services/admin.sandbox';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    TranslateModule,
    DataTableModule,
    PaginatorModule,
    TableModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    AccordionModule,
    DataScrollerModule,
    DataListModule,
    CheckboxModule,
    EditorModule,
    TabViewModule,
    PipesModule,
    GrowlModule,
    RatingModule,
    InputTextareaModule,
    TreeModule,
    RadioButtonModule,
    ComponentsModule,
    NgxEditorModule,
    MomentModule,

  ],
  declarations: [CategoriesManagementComponent, UserAccessComponent, AssetApprovalComponent, ViewAssetApprovalComponent],
  providers: [AdminSandbox, AdminApiClientService, MessageService]
})
export class AdminModule { }
