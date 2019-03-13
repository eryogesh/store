import { Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs/Observable';
import {ArtifactsApiClientService} from '../../../artifacts/services/artifacts-api-client.service';
import { AuthSandbox } from '../../../auth/services';
import { HttpResponseHandlerService } from '../../async-services/http';
import { HttpService } from '../../async-services/http';
import { UserDetails } from '../../models';
import { UtilityService } from '../../utility';
import { HttpClient } from '@angular/common/http';

const kwUserDetails = 'USER_DETAILS';
const kwSessionData = 'sessionData';
const kwDownloadCategory = 'DownloadCategory';
const kwRecentCategory = 'RecentCategory';
const kwPROJECT_ID = 'PROJECT_ID';
const kwIS_USER = 'IS_USER';
const kwPreviousURL = 'previousURL';

@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [ConfirmationService, HttpService]
})
@Injectable()
export class HeaderComponent  implements OnInit {


  resultData: any;
  
  @Input() userImage: string;
  @Input() userEmail: string;
  @Input() selectedLanguage = '';
  @Input() availableLanguages: Array<any> = [];
  @Output() selectLanguage: EventEmitter<any> = new EventEmitter();
  @ViewChild('collapsibleNavbar') collapsibleNavbar: ElementRef;
  display: boolean;
  rolid: string;
  profileId: string;
  register: Observable<boolean>;
  userType = [
    { userType: 'Category managment', value: 1 },
    { userType: 'User Access', value: 2 },
    { userType: 'Asset Approval', value: 3 }
  ];

  @Output() logout: EventEmitter<any> = new EventEmitter();
  private sessionData;
  private usrID = -1;
  private sesnID;
  private uniqID;
  public errorMessage: String;
  private copyUrl = true;
  public searchString: string;
  private codedprojectName: string;
  public copyClipboardUrl: string;
  public copyClipboardUrlPopup = false;
  public userDetails: UserDetails;
  public envUrl = this.artifactsApiClientService.getEnvironmentUrl();
  public showResults: boolean = false;
  
  constructor(
    public artifactsApiClientService:ArtifactsApiClientService,
    public httpService: HttpService,
  	public http: HttpClient,
    private router: Router,
    private confirmationService: ConfirmationService,
    private authSandbox: AuthSandbox,
    public utilityService: UtilityService,    
    public httpResponseHandlerService: HttpResponseHandlerService
    
    ) {
    this.utilityService.isRegister$ = null;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        event.url.includes('/search') ? this.searchString = decodeURI(event.url).split('search/')[1] : this.searchString = '';
      }
    });
  }

  ngOnInit() {
   
    this.sessionData = JSON.parse(sessionStorage.getItem(kwSessionData));
    if (this.sessionData) {
      this.usrID = this.sessionData.userId;
      this.sesnID = this.sessionData.sessionId;
      this.uniqID = this.sessionData.uniqueId;
      this.utilityService.isLoggedIn$ = Observable.of(true);
      this.userDetails = JSON.parse(sessionStorage.getItem(kwUserDetails));
      this.rolid =
        this.userDetails &&
        this.userDetails.userAccess &&
        this.userDetails.userAccess.roleId;
      this.profileId = this.userDetails &&
        this.userDetails.userAccess &&
        this.userDetails.userAccess.profileId;
      if (this.userDetails && this.userDetails.profileImage) {
        this.utilityService.profileImage$ = Observable.of(this.userDetails.profileImage);
      }
      if (this.utilityService.isLoggedIn$ && ((this.rolid === 'AD' && this.profileId === 'AP') || (this.rolid === 'SA'))) {
        this.utilityService.isAdmin$ = Observable.of(true);
      } else {
        this.utilityService.isAdmin$ = Observable.of(false);
      }
    } else {
      this.utilityService.isLoggedIn$ = Observable.of(false);
    }
  }

  /**
   *@description updating header navabar on click
   */
  public collapseNav() {
    const element: HTMLElement = document.getElementById('collapsibleNavbar') as HTMLElement;
    if (element) {
      element.classList.remove('show');
    }
  }

  public redirect(): void {
    this.router.navigate(['./artifacts/artifact-list']);
  }

  public registration(): void {
    this.utilityService.isRegister$ = Observable.of(true);
    this.utilityService.notifyOther(true);
  }

  public loginClicked(): void {
    this.display = true;
  }

  public logOut(): void {
    const data = { userId: this.usrID, sessionAuthKey: this.sesnID, uniqueId: this.uniqID };
    this.authSandbox.doLogout(data).subscribe(res => {
      this.resetVars();
      sessionStorage.removeItem(kwSessionData);
      sessionStorage.removeItem(kwDownloadCategory);
      sessionStorage.removeItem(kwRecentCategory);
      sessionStorage.removeItem(kwUserDetails);
      sessionStorage.removeItem(kwPROJECT_ID);
      sessionStorage.removeItem(kwIS_USER);
      sessionStorage.removeItem(kwPreviousURL);
      this.router.navigate(['/account/login']);
    }, (error) => this.httpResponseHandlerService.onCatch(error));
  }

  public resetVars(): void {
    this.utilityService.isRegister$ = null;
    this.utilityService.isAdmin$ = Observable.of(false);
    this.utilityService.isLoggedIn$ = Observable.of(false);
  }

  /**
   * @description special character validation for search string
   * @param search
   */
  valid(search: string): void {
    // tslint:disable-next-line:no-unused-expression
    !(/^[\w -]*$/i).test(search) ? this.searchString = search.replace(/[^\w -]/ig, '') : null;
  }

  selectName = function (typeOfUser, data) {
    this.userTypeName = data.value;
    if (this.userTypeName === 1) {
      this.router.navigate(['./admin/categories-management']);
    }
    if (this.userTypeName === 2) {
      this.router.navigate(['./admin/user-access']);
    }
    if (this.userTypeName === 3) {
      this.router.navigate(['./admin/asset-approval']);
    }
  };

  // ------------------------------------------------------//
  // START: Search Artifacts - Code implementation here **//
  // ----------------------------------------------------//

  /**
   * @description : Check for empty string value.
   * @param value
   */
  private isStringNotEmpty(value: string): boolean {
    if (!value) {
      this.confirmationService.confirm({
        message: 'Please enter search keyword',
        header: 'Information',
        icon: 'fa fa-info',
        accept: () => { },
        reject: () => { }
      });
      return false;
    }
    return true;
  }

  /**
   * @description : subscribe search string to get updated results
   * of searc
   * @param searchVar
   */
  searchAsset(searchVar: string): void {
    sessionStorage.setItem('SEARCH_ARTIFACTS_STRING', JSON.stringify(searchVar));
    if (this.isStringNotEmpty(searchVar)) {
      this.router.navigate(['/search/' + searchVar]);
    }
  }

  /**
   * @description on enter press call searchAsset.
   * @param
   * @param selected
   */
  ifEnterPressed($event, searchVar: string): void {
    this.copyUrl = false;
    const keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
    if (this.isStringNotEmpty(searchVar)) {
        this.router.navigate(['/search/' + searchVar]);
      }
    }
  }
  
  searchForSelectedItem($event, searchKeyword){
  	this.searchString = searchKeyword;
  	this.router.navigate(['/search/' + searchKeyword]);
  }

  /**
   * @description : show tietl to update title on copy clipboard button.
   */
  showTitle(): void {
    // TODO
  }

  /**
   * @description to remove tag from copy clip-bord button whent -
   * search string blank.
   * @param  event
   * @param selected
   */
  onKeyPressInSearch(event){
    
    if(event.keyCode == 13){ this.showResults = false;   }
    else{ this.showResults = true;  }
  }
  getSearchDataOnKeyUp(event, selected: string){    
  	if(selected.length >= 2){    
     //Subscribed search results based on characters entered in search box.
      this.http.post(this.envUrl+"/api/v1/other/getSearchTerm", 
        {
          'term':  selected
        }).subscribe(
	         (data) => { 
             if(data != undefined)
	          this.resultData = data;
	         },
	         error => {
	           console.error("Error while searching results!");
	          
	         });
    	}
  }
  removeTagOnBackspace($event, selected: string): void {
    
    if (selected && selected.length === 1) {
      this.copyUrl = true;
    }
  }

  /**
   * @description copyToClipboard to copy search url.
   */
  copyToClipboard(): string {
    this.copyClipboardUrlPopup = true;
    if (this.isStringNotEmpty(this.searchString)) {
      // ------------------
      // const arrayUrl = window.location.href.split('?');
      // if (arrayUrl[1] !== undefined && arrayUrl[1].split('projectName=')[1] !== undefined) {
      //   return (this.copyClipboardUrl = window.location.href);
      // } else {
      //   this.codedprojectName = this.searchString.replace(/\s/g, '%20');
      //   return (this.copyClipboardUrl = window.location.href + '?projectName=' + this.codedprojectName);
      // }

      return this.copyClipboardUrl = decodeURI(document.location.href);

      // ---------------
    }
  }

  /**
   * @description getUrlParameter to update the search string based on project name.
   */
  private getUrlParameter(): void {
    const arrayUrl = window.location.href.split('?');
    if (
      arrayUrl[1] !== undefined &&
      arrayUrl[1].split('projectName=')[1] !== undefined
    ) {
      this.searchAsset(arrayUrl[1].split('projectName=')[1]);
      this.searchString = decodeURIComponent(
        arrayUrl[1].split('projectName=')[1]
      );
    }
  }
	
  // ------------------------------------------------------//
  // END: Search Artifacts - Code implementation here   **//
  // ----------------------------------------------------//
}
