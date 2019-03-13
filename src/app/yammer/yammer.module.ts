import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { YammerService } from './yammer.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [YammerService]
})
export class YammerModule { }
