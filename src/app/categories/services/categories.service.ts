import { Injectable } from '@angular/core';
import { Category } from '../../shared/models';

@Injectable()
export class CategoriesService {

  private categoriesSubscription;

  /**
   * Transforms grid data categories recieved from the API into array of 'Category' instances
   *
   * @param categories
   */
  static gridAdapter(categories: any): Array<Category> {
    return categories.map(category => new Category(category));
  }

  /**
   * Transforms category details recieved from the API into instance of 'Category'
   *
   * @param category
   */
  static categoryDetailsAdapter(category: any): Category {
    return new Category(category);
  }
}
