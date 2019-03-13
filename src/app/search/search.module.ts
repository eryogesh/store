import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { DataScrollerModule } from 'primeng/datascroller';
import { DropdownModule } from 'primeng/dropdown';
import { DataListModule } from 'primeng/datalist';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search/search.component';
import { SearchApiClientService } from './services/search-api-client.service';
import { SearchSandbox } from './services/search.sandbox';
import { SearchService } from './services/search.service';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    DataViewModule,
    PanelModule,
    FormsModule,
    TranslateModule,
    DataScrollerModule,
    DropdownModule,
    DataListModule,
    PipesModule,
    TooltipModule
  ],
  declarations: [SearchComponent],
  providers: [SearchSandbox,
    SearchApiClientService,
    SearchService
  ]
})
export class SearchModule { }
