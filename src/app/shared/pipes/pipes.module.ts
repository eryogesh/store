import { NgModule } from '@angular/core';
import {SafeUrlPipe, SanitizeHtmlPipe, TruncatePipe} from './sanitize-html.pipe';

export const PIPES = [
    SanitizeHtmlPipe,
    SafeUrlPipe,
    TruncatePipe
];

@NgModule({
    imports: [],
    declarations: PIPES,
    exports: PIPES
})
export class PipesModule { }
