import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'places-edit',
    templateUrl: 'app/PlacesModule/views/edit.html',
    styleUrls: ['app/PlacesModule/views/edit.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class PlacesEditComponent implements OnInit {
    id: string;

    constructor( private route: ActivatedRoute ){}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.id = params['id'];
        });
    }
}
