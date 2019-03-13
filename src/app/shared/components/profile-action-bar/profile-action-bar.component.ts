import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-profile-action-bar',
  templateUrl: './profile-action-bar.component.html',
  styleUrls: ['./profile-action-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileActionBarComponent {

  @Input() userImage: string;
  @Input() userEmail: string;
  @Output() logout: EventEmitter<any> = new EventEmitter();

}
