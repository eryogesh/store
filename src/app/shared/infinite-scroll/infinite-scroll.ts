import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { OnInit } from '@angular/core';

@Injectable()
export class InfiniteScrollService {
  private infiniteScrollSource = new Subject<any>();

  infiniteScroll$ = this.infiniteScrollSource.asObservable();

  announceScrollEnd(e) {
    this.infiniteScrollSource.next(e);
  }
}

import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
    selector: '[infinitescroll]',
 })
export class InfiniteScrollDirective implements OnInit {

  constructor (
      private elRef: ElementRef,
      private renderer: Renderer,
      private infiniteScrollService: InfiniteScrollService
  ) { }

  ngOnInit() {
    let element: any;

    this.elRef.nativeElement.id === '' ? element = 'window' : element = this.elRef.nativeElement;
    this.renderer.listen(element, 'scroll', (event: Event) => {
      let scrollHeight: number, scrollTop: number, clientHeight: number, maxScrollTop: number;
      if (element === 'window') {
        scrollHeight = document.body.scrollHeight;
        scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        clientHeight = window.innerHeight;
        maxScrollTop = scrollHeight - clientHeight;
      } else {
        scrollHeight = element.scrollHeight;
        scrollTop = element.scrollTop;
        clientHeight = element.clientHeight;
        maxScrollTop = scrollHeight - clientHeight;
      }
      if (scrollTop >= maxScrollTop) {
        this.infiniteScrollService.announceScrollEnd(element);
      }
    })
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    InfiniteScrollDirective
  ],
  imports: [
      CommonModule
  ],
  providers: [
      InfiniteScrollService
  ],
  exports: [
    InfiniteScrollDirective
  ],
  bootstrap: []
})
export class InfiniteScrollModule { }
