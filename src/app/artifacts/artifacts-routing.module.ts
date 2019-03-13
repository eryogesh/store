import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../shared/guards/auth.guard';
import { ArtifactDetailsComponent } from './components/artifact-details/artifact-details.component';
import { ArtifactsUploadComponent } from './components/artifacts-upload/artifacts-upload.component';
import { ArtifactsComponent } from './components/artifacts/artifacts.component';
import { ArtifactFaqsComponent } from './components/artifact-faqs/artifact-faqs.component';

const routes: Routes = [
  { path: '', redirectTo: '/artifacts/artifact-list', pathMatch: 'full' },
  { path: 'artifact-list',   component: ArtifactsComponent },
  { path: 'artifact-details/:id',   component: ArtifactDetailsComponent , canActivate: [AuthGuard] , data: { allowUnAuthAccess: false }},
  { path: 'artifact-details/:id/:assetStatusId/:isPublished',   component: ArtifactDetailsComponent , canActivate: [AuthGuard] , data: { allowUnAuthAccess: false }},
  { path: 'artifact-version-details/:id',   component: ArtifactDetailsComponent , canActivate: [AuthGuard], data: { allowUnAuthAccess: false }},
  { path: 'artifact-upload',   component: ArtifactsUploadComponent, canActivate: [AuthGuard] ,data: { allowUnAuthAccess: false } },
  { path: 'artifact-faqs/:artifactOwner/:artifactId',   component: ArtifactFaqsComponent, canActivate: [AuthGuard] ,data: { allowUnAuthAccess: false } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtifactsRoutingModule { }
