import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Category } from '../../../shared/models';
import { AdminSandbox } from '../../services/admin.sandbox';
import { GlobalErrorHandler } from '../../../error-handling/global-error-handler';
import { MessageService } from 'primeng/components/common/messageservice';
import { CategoriesResponse } from '../../../shared/models/categories/categories-response.model';
import { AppSandbox } from '../../../app.sandbox';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'cs-categories-management',
  templateUrl: './categories-management.component.html',
  styleUrls: ['./categories-management.component.css'],
})

export class CategoriesManagementComponent implements OnInit {

  public subCategoryModel: string;
  public categoryModel: string;
  public categories: Category[] = [];
  private supcategoryData: any = {};
  public subcateogryData: any = [];
  // public subcategories$: Observable<Category[]>;

  constructor(private router: Router, private adminSandbox: AdminSandbox, private appSandbox: AppSandbox,
    private globalErrorHandler: GlobalErrorHandler, private messageService: MessageService) {

  }
  public displayMainCategory = false;
  public displaySubCategory = false;
  public displayDeleteDialog = false;
  public updateSubcat = false;
  public succesMsgUpdate = '';
  public errorMsgUpdate = '';
  private firstArr: any = [];
  private secondArr: any = [];
  private categoryArr: any = [];
  public selectedID: number;
  private tmpArr: any = [];
  private checkekEle: string;
  public checkedSubCategory: any = [];
  public deleteErrorMsg = '';
  public selectAtleastOneCategoryFromList = '';
  public errorMessageHeading = '';
  public successMsg = '';
  public selectAtleastOneSubcategory = '';
  public selectMainCategory = '';

  public showCategoryDialog(): void {
    this.displayMainCategory = true;
    this.categoryModel = '';
  }

  public showSubcategoryDialog(): void {
    if (this.selectedID) {
      this.displaySubCategory = true;
      this.subCategoryModel = '';
      this.errorMsgUpdate = '';
    } else {
      this.succesMsgUpdate = '';
      this.errorMsgUpdate = this.selectMainCategory;
    }
  }

  public showDeleteDialog(): void {
    this.displayDeleteDialog = true;
    this.deleteErrorMsg = '';
  }


  ngOnInit() {
    this.getCategories();
    this.catLang();
    this.appSandbox.translate.onLangChange.subscribe(() => {
      this.catLang();
    });
  }

  private catLang() {
    this.appSandbox.translate.get('Admin.CategoriesManagement.SelectAtleastOneCategoryFromList').subscribe((res: string) => {
      this.selectAtleastOneCategoryFromList = res;
    });
    this.appSandbox.translate.get('Admin.CategoriesManagement.ErrorMessage').subscribe((res: string) => {
      this.errorMessageHeading = res;
    });
    this.appSandbox.translate.get('Admin.CategoriesManagement.SelectAtleastOneSubcategory').subscribe((res: string) => {
      this.selectAtleastOneSubcategory = res;
    });
    this.appSandbox.translate.get('Admin.CategoriesManagement.SelectMainCategory').subscribe((res: string) => {
      this.selectMainCategory = res;
    });
    this.appSandbox.translate.get('Admin.Success').subscribe((res: string) => {
      this.successMsg = res;
    });
  }
  public getCategories(): void {
    this.adminSandbox.categoriesResponse$.subscribe((data: CategoriesResponse) => {
      this.categories = (data && data.categories) ? data.categories : [];
    }, error => this.globalErrorHandler.handleError(error));
  }

  public cancel(): void {
    this.displayMainCategory = false;
    this.displaySubCategory = false;
    this.displayDeleteDialog = false;
    this.deleteErrorMsg = '';
  }

  public addCategory(categoryName: string, parentID: number): void {
    if (!categoryName) {
      return;
    } else {
      this.selectedID = parentID;
      const dataReq = { 'categoryName': categoryName, 'parentCatId': this.selectedID };
      this.adminSandbox.createCategory(dataReq);
      this.adminSandbox.postResponse$.subscribe(data => {

        if (data && data.status === true) {
          this.displayMainCategory = false;
          this.displaySubCategory = false;
          this.updateSubcat = false;
          this.messageService.add({ severity: 'success', summary: this.successMsg, detail: data.msg });
          if (parentID === 0) {
            this.getCategories();
          } else {
            this.showSubCat(parentID);
          }
        } else {
          this.messageService.add({ severity: 'error', summary: this.errorMessageHeading, detail: data.msg });
        }
      }, error => this.globalErrorHandler.handleError(error));
    }
  }

  onRemoveCat(value: any, event: any): void {
    const cbIdx = this.categories.indexOf(value);
  }

  deleteCategory(): any {
    let checkedMainCat;
    for (let i = 0, len = this.categories.length; i < len; ++i) {
      if (this.categories[i].checked === true) {
        if (!checkedMainCat) {
          checkedMainCat = this.categories[i].catID;
        } else {
          checkedMainCat = checkedMainCat + ',' + this.categories[i].catID;
        }
      }
    }
    if (!checkedMainCat) {
      this.deleteErrorMsg = this.selectAtleastOneCategoryFromList;
      return false;
    }
    const dataReq = { catIds: checkedMainCat };
    this.adminSandbox.updateCategoryStatus(dataReq);
    this.adminSandbox.postResponse$.subscribe(data => {
      if (data.status === true) {
        this.displayDeleteDialog = false;
        this.messageService.add({ severity: 'success', summary: this.successMsg, detail: data.msg });
        this.ngOnInit();
      } else {
        this.messageService.add({ severity: 'error', summary: this.errorMessageHeading, detail: data.msg });
      }
    }, error => this.globalErrorHandler.handleError(error));
  }

  public showSubCat(id: any): void {
    // tslint:disable-next-line:radix
    id = parseInt(id);
    this.errorMsgUpdate = '';
    if (this.categories === undefined) {
      this.succesMsgUpdate = '';
      this.errorMsgUpdate = this.selectMainCategory;
    } else {
      this.selectedID = null;
      for (let i = 0, len = this.categories.length; i < len; ++i) {
        if (this.categories[i].catID === id) {
          this.selectedID = this.categories[i].catID;
        }
      }
      if (this.selectedID) {
        this.updateSubcat = true;
        this.adminSandbox.loadSubCategories();
        this.adminSandbox.subcategories$
          .subscribe(data => {
            if (data) {
              this.supcategoryData = data;
              this.subcateogryData = this.supcategoryData.mapping;
              this.firstArr = []; this.secondArr = []; this.categoryArr = [];
              for (let i = 0, firstCategoryLen = this.subcateogryData.length; i < firstCategoryLen; ++i) {
                if (this.subcateogryData[i].catParentId === this.selectedID) {

                  this.firstArr.push(this.subcateogryData[i]);
                } else {
                  this.secondArr.push(this.subcateogryData[i]);
                }
              }
              for (let j = 0, secondCategoryLen = this.firstArr.length; j < secondCategoryLen; ++j) {
                this.categoryArr.push(this.firstArr[j]);
              }
              for (let k = 0, thirdCategoryLen = this.secondArr.length; k < thirdCategoryLen; ++k) {
                this.categoryArr.push(this.secondArr[k]);
              }
              this.tmpArr = [];
              this.subcateogryData = [];
              for (let i = 0, lastCategoryLen = this.categoryArr.length; i < lastCategoryLen; ++i) {
                this.checkekEle = this.categoryArr[i].catID;
                if (this.tmpArr.indexOf(this.checkekEle) === -1) {
                  this.tmpArr.push(this.checkekEle);
                  this.subcateogryData.push(this.categoryArr[i]);
                }
              }
            }

          }, error => this.globalErrorHandler.handleError(error));
      } else {
        this.updateSubcat = false;
      }
    }
  }

  public onUpdateCat(value: any, event: any): void {
    const idx = this.subcateogryData.indexOf(value);
    if (event.target.checked) {
      value['checked'] = true;
    } else {
      value['checked'] = false;
    }
  }

  public updateSubcategory(): void {
    this.checkedSubCategory = [];
    for (let i = 0, len = this.subcateogryData.length; i < len; ++i) {
      if ($('#' + this.subcateogryData[i].catID).is(':checked')) {
        this.checkekEle = this.subcateogryData[i].catID;
        if (this.checkedSubCategory.indexOf(this.checkekEle) === -1) {
          this.checkedSubCategory.push(this.checkekEle);
        }
      }
    }
    if (this.checkedSubCategory.length === 0) {
      this.errorMsgUpdate = this.selectAtleastOneSubcategory;
    } else {
      this.errorMsgUpdate = null;
      const dataReq = {
        'parentCatId': this.selectedID, 'subCatIds': this.checkedSubCategory.toString(),
        'isActive': '1'
      };
      this.adminSandbox.updateSubcategoryStatus(dataReq)
        .subscribe(data => {
          if (data && data.status === true) {
            this.messageService.add({ severity: 'success', summary: this.successMsg, detail: data.msg });
          } else {
            this.messageService.add({ severity: 'error', summary: this.errorMessageHeading, detail: data.msg });
          }
        }, error => this.globalErrorHandler.handleError(error));
    }
  }
}


