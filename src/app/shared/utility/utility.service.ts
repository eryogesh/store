import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ConfigService } from '../../app-config.service';
import { User } from '../models/auth/user.model';

const kwSessionData = 'sessionData';
const kwCurrentUser = 'currentUser';
const kwUserDetails = 'USER_DETAILS';
@Injectable()
export class UtilityService {
  private sessionData: Storage;
  private loggedUser: Storage;
  private userDetails: Storage;
  private datepipe: DatePipe = new DatePipe('en-US');

  public isLoggedIn$: Observable<boolean> = Observable.of(false);
  public isAdmin$: Observable<boolean> = Observable.of(false);
  public isRegister$: Observable<boolean>;
  public profileImage$: Observable<string>;
  public userName$: Observable<string>;
  public titleName$: Observable<string>;
  public designation$: Observable<string>;
  public tileDesignation$: Observable<string>;
  private notify = new Subject<any>();
  public resetObservable$ = this.notify.asObservable();
  public sessionMessage: any;
  public errorMessage: any;
  public sessionModule: any;


  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationsService,
    private configService: ConfigService
  ) {
    this.userDetails = JSON.parse(sessionStorage.getItem(kwUserDetails));
    this.sessionData = JSON.parse(sessionStorage.getItem(kwSessionData));
    this.loggedUser = JSON.parse(sessionStorage.getItem(kwCurrentUser));
    if (this.sessionData) {
      this.isLoggedIn$ = Observable.of(true);
      this.isRegister$ = Observable.of(false);

      if (this.userDetails && this.userDetails.name) {
        this.userName$ = Observable.of(this.userDetails.name.substring(0, 10));
        this.titleName$ = Observable.of(this.userDetails.name);
      }
      if (this.userDetails && this.userDetails.designation) {
        this.designation$ = Observable.of(this.userDetails.designation.substring(0, 10));
        this.tileDesignation$ = Observable.of(this.userDetails.designation);
      }
      if (this.userDetails && this.userDetails.profileImage) {
        this.profileImage$ = Observable.of(this.userDetails.profileImage);
      }
    }

    if (this.sessionData && this.userDetails) {
      const roleId =
        this.userDetails.userAccess && this.userDetails.userAccess.roleId;
      const profileId = this.userDetails.userAccess && this.userDetails.userAccess.profileId;
      if ((roleId === 'AD' && profileId === 'AP') || (roleId === 'SA')) {
        this.isAdmin$ = Observable.of(true);
      }
    }
  }

  public notifyOther(data: boolean) {
    if (data) {
      this.notify.next(data);
    }
  }

  /**
   * Translates given message code and title code and displays corresponding notification
   *
   * @param messageTranslationCode
   * @param type
   * @param titleTranslationCode
   */
  public displayNotification(
    messageTranslationCode: string,
    type: string = 'info',
    titleTranslationCode?: string
  ) {
    const message: string = this.translateService.instant(
      messageTranslationCode
    );
    let title: string = titleTranslationCode
      ? this.translateService.instant(titleTranslationCode)
      : null;

    switch (type) {
      case 'error':
        title = this.translateService.instant('ErrorNotificationTitle');
        break;

      case 'success':
        title = this.translateService.instant('SuccessNotificationTitle');
        break;

      case 'alert':
        title = this.translateService.instant('WarningNotificationTitle');
        break;

      default:
        title = this.translateService.instant('InfoNotificationTitle');
        break;
    }

    this.notificationService[type](
      title,
      message,
      this.configService.get('notifications').options
    );
  }

  /**
   * Translates lookup names by looking into lookup code
   *
   * @param data
   */
  public translateLookupData(data: Array<any>): Array<any> {
    // Translate quantity stock adjustment reasons
    return data.map(lookup => {
      lookup.name = lookup.code
        ? this.translateService.instant('Lookups')[lookup.code]
        : lookup.name;
      return lookup;
    });
  }

  /**
   * @description getExt: return file extension
   * @param ext: contain string of file name with extension
   */
  public getExt(ext) {
    if (!ext) {
      return 'file.png';
    }
    ext = ext.toLowerCase();
    if (ext.match(/(doc|docx|word|wordx)$/i)) {
      return 'doc.png';
    } else if (ext.match(/(xls|xlsx|xlr|csv|excel)$/i)) {
      return 'csv.png';
    } else if (ext.match(/(ppt|pptx|pps)$/i)) {
      return 'ppt.png';
    } else if (
      ext.match(/(7z|cbr|deb|gz|pkg|rar|rpm|sitx|tar.gz|zip|zipx)$/i)
    ) {
      return 'rarlab_winrar.png';
    } else if (
      ext.match(/(asp|aspx|cer|cfm|csr|css|htm|html|js|jsp|php|rss|xhtml)$/i)
    ) {
      return 'html.png';
    } else if (
      ext.match(
        /(avi|mpg|mkv|mov|mp4|3gp|webm|wmv|mp3|wav|m4v|rm|vob|srt|flv|asx|asf)$/i
      )
    ) {
      return 'avi.png';
    } else if (ext.match(/(pdf|pct|indd)$/i)) {
      return 'pdf.png';
    } else if (ext.match(/(xml|json)$/i)) {
      return 'xml.png';
    } else if (
      ext.match(/(bmp|dds|gif|jpg|png|psd|psp|tga|thm|tif|tiff|yuv)$/i)
    ) {
      return 'bmp.png';
    } else if (ext.match(/(ai|eps|ps|svg)$/i)) {
      return 'ai.png';
    } else if (ext.match(/(accdb|dbf|mdb|pdb|sql)$/i)) {
      return 'accdb.png';
    } else if (ext.match(/(apk|app|bat|cgi|com|exe|gadget|jar|pif|vb|wsf)$/i)) {
      return 'bat.png';
    } else if (ext.match(/(fnt|fon|otf|ttf)$/i)) {
      return 'otf.png';
    } else if (ext.match(/(cnf|prf)$/i)) {
      return 'CNF.png';
    } else if (ext.match(/(bak|tmp)$/i)) {
      return 'file.png';
    } else if (ext.match(/(aif|iff|m3u|m4a|mid|mp3|mpa|ra|wav|wma)$/i)) {
      return 'aif.png';
    } else if (
      ext.match(
        /(c|class|cpp|cs|dtd|fla|h|java|lua|m|pl|py|sh|sln|swift|vcxproj|xcodeproj)$/i
      )
    ) {
      return 'cpp.png';
    } else if (
      ext.match(/(cab|cpl|cur|deskthemepack|dll|dmp|drv|icns|ico|lnk|sys)$/i)
    ) {
      return 'drv.png';
    } else if (ext.match(/(dem|gam|nes|rom|sav)$/i)) {
      return 'sav.png';
    } else if (ext.match(/(log|msg|odt|pages|rtf|tex|txt|wpd|wps|ini|md)$/i)) {
      return 'text.png';
    } else {
      return 'file.png';
    }
  }

  /**
   * @description this method used for generate dynamic img url.
   * @param imgUrl
   * @param imgType
   */
  public getProjectImage(imgUrl: string, imgType: string): string {
    if (imgUrl && imgUrl.replace(/ /g, '%20')) {
      return (
        this.configService.get('api').downloadUrl +
        '' +
        imgUrl.replace(/\\/g, '/')
      );
    } else {
      return 'images/' + this.getExt(imgType);
    }
  }

  /**
   * @description this method will return default img url on error in project img path.
   * @param event
   */
  public imgErorHandler(event, imgType: string): void {
    if (imgType === 'project') {
      event.target.src =
        '../../../assets/images/Homepage/project-background-2.png';
    } else if (imgType === 'user') {
      event.target.src = '../../../assets/images/user-icon.png';
    } else {
      event.target.src = '../../../assets/images/bmp.png';
    }
  }

  /**
   * @description setting session data globely
   * @param sessionData
   */
  public setSessionData(sessionData: any): void {
    this.sessionData = sessionData;
  }

  /**
 * @description get current session data
 */
  public getSessionData(): any {
    return this.sessionData;
  }

  /**
   * @description get curretn user details
   */
  public getLoggedUser(): Observable<User> {
    return Observable.of<User>(new User(this.loggedUser));
  }

  /**
   * @description transform your date as you need.
   * @param date
   * @param formate
   */
  public transformDate(date: Date, formate: string): string {
    return this.datepipe.transform(date, formate);
  }

  public getIsSSOEnabled(): boolean {
    return this.configService.get('IsSSOEnabled');
  }

  public generateUUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        // tslint:disable-next-line:no-bitwise
        const r = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        // tslint:disable-next-line:no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }
}
