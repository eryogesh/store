import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from './categories/categories/categories.component';
import { ActivationComponent } from './shared/components/activation/activation.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';

const appRoutes: Routes = [
  { path: 'activeAccount',
  component: ActivationComponent,
  canActivate: [AuthGuard],
  data: { allowUnAuthAccess: true }
},
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
    data: { allowUnAuthAccess: true }
  },
  {
    path: 'artifacts',
    loadChildren: './artifacts/artifacts.module#ArtifactsModule',
    canActivate: [AuthGuard],
    data: { allowUnAuthAccess: true }
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    data: { allowUnAuthAccess: false }
  },
  {
    path: 'account',
    loadChildren: './auth/auth.module#AuthModule',
    canActivate: [AuthGuard],
    data: { allowUnAuthAccess: true }
  },
  {
    path: 'search/:searchString',
    loadChildren: './search/search.module#SearchModule',
    canActivate: [AuthGuard],
    data: { allowUnAuthAccess: true }
  },
  // { path: '', redirectTo: '/categories', pathMatch: 'full' },
  {
    path: '',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
    data: { allowUnAuthAccess: true }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
