import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  // private currentTimeout: any;
  // private isDelayedRunning: boolean = false;

  // @Input()
  // public delay: number = 300;

  @Input() isRunning: boolean;
  @Input() isSmall: string;
  // public set isRunning(value: boolean) {
  //   if (!value) {
  //     this.cancelTimeout();
  //     this.isDelayedRunning = false;
  //     return;
  //   }

  // if (this.currentTimeout) {
  //   return;
  // }

  // this.currentTimeout = setTimeout(() => {
  //   this.isDelayedRunning = value;
  //   this.cancelTimeout();
  // }, this.delay);
  // }

  // private cancelTimeout(): void {
  //   clearTimeout(this.currentTimeout);
  //   this.currentTimeout = undefined;
  // }

  // ngOnDestroy(): any {
  //   this.cancelTimeout();
  // }

}
