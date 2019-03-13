import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cs-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  @Input() tags: any;
  // @Input() placeHolder: string;
  @Output() tagAdded: EventEmitter<any> = new EventEmitter();
  constructor() { }
  // public validators;
  public validators = [this.minLength, this.maxLength, this.valRequired];

  public errorMessages = {
    'minVal': 'Tags should contain minimum 2 characters',
    'maxVal': 'Tags can contain maximum 100 characters',
    'requiredVal': 'Tags is required'
  };

  ngOnInit() {
    // this.validators = [this.Required];
  }

  //   private Required(control: FormControl) {
  //     control.setValidators([Validators.minLength(2), Validators.maxLength(100)]);
  // }

  private minLength(control: FormControl) {
    if (control.value.length < 2) {
      return {
        'minVal': true
      };
    }
    return null;
  }

  private maxLength(control: FormControl) {
    if (control.value.length > 100) {
      return {
        'maxVal': true
      };
    }

    return null;
  }

  private valRequired(control: FormControl) {
    if (control.value === '' || control.value === null || control.value === undefined) {
      return {
        'requiredVal': true
      };
    }
    return null;
  }

  onItemAdded(event) {
    this.tagAdded.emit(this.tags);
  }

  onItemRemoved(event) {
    this.tagAdded.emit(this.tags);
  }

}
