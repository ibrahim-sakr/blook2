import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'terminal-root',
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None
})
export class TerminalRootComponent { }
