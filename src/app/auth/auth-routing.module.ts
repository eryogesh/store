import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { SessionComponent } from './components/session/session.component';

const routes: Routes = [
  { path: '', redirectTo: '/account/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard], data: { allowUnAuthAccess: false } },
  { path: 'changepassword', component: ChangePasswordComponent },
  { path: 'session', component: SessionComponent}
  // {
  //   path: 'forgot-password',
  //   component: ForgotPasswordComponent

  // },
  // {
  //   path: 'reset-password',
  //   component: ResetPasswordComponent

  // }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
