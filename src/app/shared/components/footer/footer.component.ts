import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  bottomList: Array<any> = [{ count: '2000k+', title: 'Reusable Assets' }, { count: '500k+', title: 'Active Members' },
  { count: '6000k+', title: 'Mobile Applications' }, { count: '$250k+', title: 'Saved on Project Cost' }];
  constructor(private router: Router) {

  }

}
