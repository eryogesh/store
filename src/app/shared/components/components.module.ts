import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, ConfirmDialogModule } from 'primeng/primeng';

import { ArtifactsModule } from '../../artifacts/artifacts.module';
import { AuthModule } from '../../auth/auth.module';
import { PipesModule } from '../pipes/pipes.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ActivationComponent } from './activation/activation.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileActionBarComponent } from './profile-action-bar/profile-action-bar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { NotificationsService } from 'angular2-notifications';
import { TagInputModule } from 'ngx-chips';



export const COMPONENTS = [
  SpinnerComponent,
  NavigationComponent,
  ProfileActionBarComponent,
  HeaderComponent,
  LanguageSelectorComponent,
  PageNotFoundComponent,
  FooterComponent,
  ActivationComponent,
];

@NgModule({
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    PipesModule,
    DialogModule,
    MessagesModule,
    AuthModule,
    DropdownModule,
    TooltipModule,
    MenubarModule,
    ArtifactsModule,
    ConfirmDialogModule,
    TagInputModule
  ],
  providers: [
    ConfirmationService,NotificationsService],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ComponentsModule { }
