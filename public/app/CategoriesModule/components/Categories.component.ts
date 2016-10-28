import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';

@Component({
    selector: 'categories',
    templateUrl: 'app/CategoriesModule/views/category.html',
    styleUrls: ['app/CategoriesModule/css/category.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class CategoriesComponent implements OnInit {
    type: string;

    constructor( private route: ActivatedRoute ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.type = params['type'];
        });
    }
}
