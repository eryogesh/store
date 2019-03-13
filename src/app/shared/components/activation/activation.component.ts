import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ActivationService} from '../../../shared/utility/activation.service';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { UtilityService } from '../../utility';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'cs-activeuser',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivationComponent implements OnInit {

  public search: any;
  public successFlag = false;
  public errorFlag = false;
  public successmsg = '';
  public errormsg = '';
  constructor(private router: Router , private activateRoute: ActivatedRoute, private activationService: ActivationService,
    private globalErrorHandler: GlobalErrorHandler, private utilityService: UtilityService) {
     this.activateRoute.queryParams.subscribe(params => {
       this.search = params['userId'];
     });
  }
  ngOnInit() {
    // $rootScope.activeaccout = true;
    //  console.log(' this.param1', this.search);
      if (this.search.length !== 0) {
        this.activationService.activationUserLink(this.search).subscribe(data => {
          if (data.status) {
             this.successFlag = true;
             this.successmsg = data.status;
              // this.activeaccout = true;
          } else {
              this.errormsg = data.statusText;
              this.errorFlag = true;
          }
        });
    }
  }

  gotoLogin() {
    if (this.successFlag === true) {
      this.utilityService.isLoggedIn$ = Observable.of(true);
      this.router.navigate(['']);
    } else {
      this.utilityService.isLoggedIn$ = Observable.of(false);
    }
  }
}
