import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(v: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(v);
  }

}

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(url: string): SafeUrl {
    const data = this.domSanitizer.bypassSecurityTrustUrl(url);
    return data;
  }
}

@Pipe({
  name: 'truncate'
 })
 export class TruncatePipe implements PipeTransform {
 transform(value: string, args: string[]): string {
     const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
     const trail = args.length > 14 ? args[1] : '';
     return value.length > limit ? value.substring(0, limit) + trail : value;
    }
 }
