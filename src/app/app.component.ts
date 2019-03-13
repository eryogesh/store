import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';

import { Component, HostBinding, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { AppSandbox } from './app.sandbox';
import {Message} from 'primeng/components/common/api';
import { ConfigService } from './app-config.service';

declare var ga: any;
const kwPreviousURL = 'previousURL';

@Component({
  selector: 'cs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public msgs: Message[] = [];
  public msgSummary:string;
  @HostBinding('class.body-loginPage') public isLoginPage: boolean;

  constructor(private router: Router,
    public appSandbox: AppSandbox,  private configService: ConfigService) {
    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        sessionStorage.setItem(kwPreviousURL, event[0].urlAfterRedirects);
      });
  }

  ngOnInit() {
    this.appSandbox.setupLanguage();
    // Load uspromptcal storage into redux state
    this.appSandbox.loadUser();
    this.registerEvents();

    if(this.detectIE()){
      if(JSON.parse(sessionStorage.getItem('currentUser'))===null){
        this.initIEMsg();
        sessionStorage.setItem('currentUser', JSON.stringify(true));
      }
    }
    let gaId = this.getGoogleEnvAccountId();
    ga('create',gaId, 'auto');
  }

  /**
   * Registers events needed for the application
   */
  private registerEvents(): void {
    // Subscribes to route change event and sets "isLoginPage" variable in order to set correct CSS class on body tag.
    this.router.events.subscribe((route) => {
      this.isLoginPage = route['url'] === '/login' ? true : false;
    });
    // localStorage.clear();
    // sessionStorage.clear();
  }

  private getGoogleEnvAccountId(): string {
    return this.configService.get("googleEnvAccountId");
  }

  public initIEMsg(){
    this.msgSummary = "Attention: You are using a browser that is not fully supported, some functionalities may not be available. CapStore is best viewed on Chrome (for Windows) and Safari (for Mac). We recommend you access CapStore from these browsers only."
    this.msgs = [];
    this.msgs.push({severity:'warn', detail:this.msgSummary});
  }

  private detectIE() {
    var ua = window.navigator.userAgent;
     var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
  
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
  
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
  
    // other browser
    return false;
  }
}
