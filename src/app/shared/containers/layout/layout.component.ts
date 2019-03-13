import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConfigService } from '../../../app-config.service';
import { LoadingIndicatorService } from '../../../loading-indicator/loading-indicator.service';
import { HttpResponseHandlerService } from '../../async-services/http';
import { HeaderComponent } from '../../components/header/header.component';
import { LayoutSandbox } from './layout.sandbox';

@Component({
  selector: 'cs-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  @ViewChild(HeaderComponent) controls: HeaderComponent;
  public isLoading = false;
  public userImage = '';
  public userEmail = '';
  private assetsFolder: string;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private configService: ConfigService,
    public layoutSandbox: LayoutSandbox,
    private loadingIndicatorService: LoadingIndicatorService,
    private cdref: ChangeDetectorRef,
    public httpResponseHandlerService: HttpResponseHandlerService
  ) {
    this.assetsFolder = this.configService.get('paths').userImageFolder;
    // change isLoading status whenever notified
    this.loadingIndicatorService.onLoadingChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
      this.cdref.detectChanges();
    });
  }

  ngOnInit() {
    this.registerEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registerEvents() {
    // Subscribes to user changes
    this.subscriptions.push(this.layoutSandbox.user$.subscribe(user => {
      if (user) {
        this.userImage = this.assetsFolder + 'user.jpg';
        this.userEmail = user.email;
      }
    }));
  }

  /**
   *@description checking for child component
   */
  public navBarTogglerIsVisible() {
    return this.controls.collapseNav();
  }

  /**
   *@description call for update child componetn
   */
  public collapseNav() {
    if (this.navBarTogglerIsVisible()) {
      this.controls.collapseNav();
    }
  }

}
