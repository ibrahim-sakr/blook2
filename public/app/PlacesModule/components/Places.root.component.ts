import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'places-root',
    template: '<router-outlet></router-outlet>',
    encapsulation: ViewEncapsulation.None
})
export class PlacesRootComponent { }
