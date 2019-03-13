import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/components/common/messageservice';
import { DataListModule } from 'primeng/datalist';
import { DataScrollerModule } from 'primeng/datascroller';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { GrowlModule } from 'primeng/growl';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

import { PipesModule } from '../shared/pipes/pipes.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthApiClientService, AuthSandbox } from './services';
import { Ng2ImgToolsModule } from 'ng2-img-tools';
import { SessionComponent } from './components/session/session.component';

export const COMPONENTS = [
  UserProfileComponent,
  LoginComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  ChangePasswordComponent,
  SessionComponent
];

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    MessagesModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    ButtonModule,
    DataViewModule,
    GrowlModule,
    DialogModule,
    DataListModule,
    CheckboxModule,
    PipesModule,
    ProgressSpinnerModule,
    TooltipModule,
    DropdownModule,
    DataScrollerModule,
    TranslateModule,
    Ng2ImgToolsModule
  ],
  declarations: COMPONENTS,
  providers: [
    AuthSandbox,
    AuthApiClientService,
    MessageService,
  ],
  exports: COMPONENTS
})
export class AuthModule { }
