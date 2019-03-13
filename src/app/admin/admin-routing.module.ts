import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetApprovalComponent } from './components/asset-approval/asset-approval.component';
import { CategoriesManagementComponent } from './components/categories-management/categories-management.component';
import { UserAccessComponent } from './components/user-access/user-access.component';
import { ViewAssetApprovalComponent } from './components/view-asset-approval/view-asset-approval.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin/categories', pathMatch: 'full' },
  { path: 'categories-management', component: CategoriesManagementComponent },
  { path: 'user-access', component: UserAccessComponent },
  { path: 'asset-approval', component: AssetApprovalComponent },
  { path: 'view-asset-approval/:id', component: ViewAssetApprovalComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
