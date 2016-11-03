import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'page-not-found',
    templateUrl: 'app/NotfoundModule/views/page_not_found.html',
    styleUrls: ['app/NotfoundModule/css/page_not_found.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class NotfoundComponent {
    constructor( private location: Location ){}

    goBack(): void {
        this.location.back();
    }
}
