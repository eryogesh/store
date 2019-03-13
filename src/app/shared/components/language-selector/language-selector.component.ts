import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'cs-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class LanguageSelectorComponent {

  @Input() selectedLanguage = '';
  @Input() availableLanguages: Array<any> = [];
  @Output() select: EventEmitter<any> = new EventEmitter();

  public show = false;

  constructor(private elementRef: ElementRef) { }

  // @HostListener('document:click')
  public onDocumentClick($event): void {
    if (!this.elementRef.nativeElement.contains($event.target)) {
      this.show = false;
    }
  }

  public onToggle(): void {
    this.show = !this.show;
  }

  public selectLanguage(lang: any) {
    this.show = false;
    this.select.emit({ code: lang.code, culture: lang.culture });
  }

}
