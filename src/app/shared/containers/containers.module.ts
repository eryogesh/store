import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { ComponentsModule } from '../components/components.module';
import { TranslateModule } from 'ng2-translate';
import { LayoutSandbox } from './layout/layout.sandbox';
import { RouterModule } from '@angular/router';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

export const CONTAINERS = [
  LayoutComponent
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    TranslateModule,
    RouterModule,
    MessagesModule,
    MessageModule
  ],
  declarations: CONTAINERS,
  exports: CONTAINERS,
  providers: [LayoutSandbox]
})
export class ContainersModule { }
