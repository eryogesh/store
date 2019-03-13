export class Category {
    categoryName: string;
    catID: number;
    catParentId: number;
    isActive: number;
    isChecked: boolean;
    checked: boolean;

    constructor(category: any = null) {
        this.categoryName = category ? category.categoryName : '';
    }
}

export class CategoriesForUpload {
  categories: Category[];
  constructor() {}
}

export class CategoriesData {
    numberOfArtifacts: number;
    activeUsers: number;
    numberOfMobApp: number;
    constructor() {}
  }

/**
* @description category details class
*/
export class CategoriesDetails {
 tag: string;
 catIds: string;
 profileMapping: string;
 userId: string;
 uniqueId: string;
 sessionAuthKey: string;
}

