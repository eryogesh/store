import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';

import { AuthModule } from '../auth/auth.module';
import { ComponentsModule } from '../shared/components/components.module';
import { ContainersModule } from '../shared/containers/containers.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesApiClientService } from './services/categories-api-client.service';
import { CategoriesResolver } from './services/categories.resolver';
import { CategoriesSandbox } from './services/categories.sandbox';
import { CategoriesService } from './services/categories.service';


@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    ContainersModule,
    TranslateModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    MessagesModule,
    PanelModule,
    AuthModule
  ],
  declarations: [CategoriesComponent],
  providers: [
    CategoriesSandbox,
    CategoriesService,
    CategoriesApiClientService,
    CategoriesResolver
  ]
})
export class CategoriesModule { }
