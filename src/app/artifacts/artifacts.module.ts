import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
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
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { GrowlModule } from 'primeng/growl';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import {
  ConfirmationService,
  ConfirmDialogModule,
  DataGridModule,
  InputTextareaModule,
  TabViewModule,
} from 'primeng/primeng';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';

import { PipesModule } from '../shared/pipes/pipes.module';
import { ArtifactsRoutingModule } from './artifacts-routing.module';
import { ArtifactDetailsComponent } from './components/artifact-details/artifact-details.component';
import { ArtifactFaqsComponent } from './components/artifact-faqs/artifact-faqs.component';
import { ArtifactRelatedComponent } from './components/artifact-related/artifact-related.component';
import { ArtifactReviewComponent } from './components/artifact-review/artifact-review.component';
import { ArtifactsUploadComponent } from './components/artifacts-upload/artifacts-upload.component';
import { ArtifactsComponent } from './components/artifacts/artifacts.component';
import { ArtifactsApiClientService } from './services/artifacts-api-client.service';
import { ArtifactsResolver } from './services/artifacts.resolver';
import { ArtifactsSandbox } from './services/artifacts.sandbox';
import { ArtifactsService } from './services/artifacts.service';
import { MomentModule } from 'ngx-moment';
import { TagInputModule } from 'ngx-chips';
import {TagsComponent} from '../shared/components/tags/tags.component';

export const PRIMENG = [
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
  MomentModule
];
@NgModule({
  imports: [
    CommonModule,
    ArtifactsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    NgxEditorModule,
    AngularFontAwesomeModule,
    PRIMENG,
    TranslateModule,
    TagInputModule
  ],
  declarations: [
    ArtifactsComponent,
    ArtifactDetailsComponent,
    ArtifactsUploadComponent,
    ArtifactFaqsComponent,
    ArtifactReviewComponent,
    ArtifactRelatedComponent,
    TagsComponent
  ],
  providers: [
    ArtifactsApiClientService,
    ArtifactsService,
    ArtifactsSandbox,
    ArtifactsResolver,
    MessageService,
    HttpClient,
    ConfirmationService
  ]
})
export class ArtifactsModule { }
