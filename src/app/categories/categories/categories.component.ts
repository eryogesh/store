import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesSandbox } from '../services/categories.sandbox';
import { ISubscription } from 'rxjs/Subscription';
import { UserDetails, UserAccess, CategoriesData } from '../../shared/models';
import { GlobalErrorHandler } from '../../error-handling/global-error-handler';
import { AppSandbox } from '../../app.sandbox';
import { SignUpComponent } from '../../auth/components/sign-up/sign-up.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'cs-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {
  images: any;
  categoryArray: any;
  userDetails: UserDetails;
  public titleReusableAssets = '';
  public titleActiveMembers = '';
  public titleWorkingHoursSaved = '';
  public titleSavedOnProjectCost = '';
  public countingBottomText: Array<any> = [];  
  public reusableAssets: number;
  public activeMembers: number;
  public mobileApp: number;

  @ViewChild(SignUpComponent) signupComponent: SignUpComponent;

  imageList: Array<any> = [
    { imageName: 'banking1.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'finance1.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'Digital_interactive_channels.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'wealth1.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'insurance1.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'category-51.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'Content_Management.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'Customer_Management.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'Commerce_Management.png', title: '', categoryid: { catID: '', listSubCategories: [] } },
    { imageName: 'Smart_processes_and_digital_integration.png', title: '', categoryid: { catID: '', listSubCategories: [] } }
  ];
  imageTopList = this.imageList.slice(0, 4);
  BottomList = this.imageList.slice(5, 9);
  // console.log('BottomList'+ BottomList);
  // newBottomList1 = this.imageList.slice(6, 9);
  // newBottomList2 = this.imageList.slice(9, 10);

  // imageTopList = this.imageList.slice(0, 3);
  // BottomList = this.imageList.slice(3, 6);
  // newBottomList1 = this.imageList.slice(6, 9);
  // newBottomList2 = this.imageList.slice(9, 10);
  private subscription: ISubscription;
  display: boolean;
  tour: boolean;
  constructor(
    private router: Router,
    public categoriesSandbox: CategoriesSandbox,
    private globalErrorHandler: GlobalErrorHandler, public appSandbox: AppSandbox,
    private http: HttpClient
  ) {
  }
  ngOnInit() {
    this.categoriesSandbox.categoriesData$.subscribe((data: CategoriesData) => {
      this.reusableAssets = data.numberOfArtifacts;
      this.activeMembers = data.activeUsers;
      this.mobileApp = data.numberOfMobApp;

      this.appSandbox.translate.onLangChange.subscribe(() => {
        if (this.countingBottomText.length > 0) {
          this.countingBottomText = [];
          this.appSandbox.translate.get('Categories.TitleReusableAssets').subscribe((res: string) => {
            this.titleReusableAssets = res;
            this.countingBottomText.push({ count: this.reusableAssets, title: this.titleReusableAssets });
          });
          this.appSandbox.translate.get('Categories.TitleActiveMembers').subscribe((res: string) => {
            this.titleActiveMembers = res;
            this.countingBottomText.push({ count: this.activeMembers, title: this.titleActiveMembers });
          });
          this.appSandbox.translate.get('Categories.TitleWorkingHoursSaved').subscribe((res: string) => {
            this.titleWorkingHoursSaved = res;
            this.countingBottomText.push({ count: this.mobileApp, title: this.titleWorkingHoursSaved });
          });
          //  this.appSandbox.translate.get('Categories.TitleSavedOnProjectCost').subscribe((res: string) => {
          //   this.titleSavedOnProjectCost = res;
          //    this.countingBottomText.push({ count: '$250k+', title: this.titleSavedOnProjectCost });
          // });
        }
      });


      if (this.countingBottomText && this.countingBottomText.length <= 0) {
        this.appSandbox.translate.get('Categories.TitleReusableAssets').subscribe((res: string) => {
          this.titleReusableAssets = res;
          this.countingBottomText.push({ count: this.reusableAssets, title: this.titleReusableAssets });
        });
        this.appSandbox.translate.get('Categories.TitleActiveMembers').subscribe((res: string) => {
          this.titleActiveMembers = res;
          this.countingBottomText.push({ count: this.activeMembers, title: this.titleActiveMembers });
        });
        this.appSandbox.translate.get('Categories.TitleWorkingHoursSaved').subscribe((res: string) => {
          this.titleWorkingHoursSaved = res;
          this.countingBottomText.push({ count: this.mobileApp, title: this.titleWorkingHoursSaved });
        });
        // this.appSandbox.translate.get('Categories.TitleSavedOnProjectCost').subscribe((res: string) => {
        //   this.titleSavedOnProjectCost = res;
        //   this.countingBottomText.push({ count: '$250k+', title: this.titleSavedOnProjectCost });
        // });
      }
    }, error => this.globalErrorHandler.handleError(error)
    );


    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    if (sessionData === null) {
      this.subscription = this.categoriesSandbox.categories$.subscribe(data => {
        if (data !== null || data !== undefined) {
          this.categoryArray = data;
          for (let counter = 0; counter < this.categoryArray.length; counter++) {
            this.imageList[counter].title = this.categoryArray[counter].categoryName;
            this.imageList[counter].categoryid.catID = this.categoryArray[counter].catID;
          }
          const a = this.imageList[2];
          const b = this.imageList[5];
          this.imageList[2] = b;
          this.imageList[5] = a;
          this.imageTopList = this.imageList.slice(0, 5);
          this.BottomList = this.imageList.slice(5, 10);
          // this.newBottomList1 = this.imageList.slice(6, 9);
          // this.newBottomList2 = this.imageList.slice(9, 10);
        }
      }, error => this.globalErrorHandler.handleError(error));

    } else {
      this.router.navigate(['artifacts']);
    }

    // -- reset sessionStorage on load landing .... cownload category and recent category.
    sessionStorage.setItem('DownloadCategory', null);
    sessionStorage.setItem('RecentCategory', null);

  }

  gotoHomePage = function (category) {
    const catArray = [];
    if (category !== undefined && category !== null) {
      catArray.push(category);
    }
    sessionStorage.setItem('DownloadCategory', JSON.stringify(catArray));
    sessionStorage.setItem('RecentCategory', JSON.stringify(catArray));
    this.router.navigate(['artifacts']);
  };

  videoPopup() {
    this.tour = true;
  }

  register() {
    this.display = true;
    this.signupComponent.resetFields();
  }


  setUSerProfile(profile: string): void {
    const userAccess: UserAccess = {
      profileId: profile,
      userRole: '',
      roleId: '',
      userProfile: '',
      userId: '-1'
    };

    const user: UserDetails = {
      shortID: '',
      lastLogin: '',
      emailID: '',
      profileImage: '../../../assets/images/user-icon.png',
      isActive: '',
      categoryPrefs: '',
      userID: 1,
      userAccess: userAccess,
      name: '',
      isApproved: 0,
      designation: '',
    };
    this.userDetails = user;
    sessionStorage.setItem('USER_DETAILS', JSON.stringify(this.userDetails));
    this.gotoHomePage(null);
  }

}
