import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GeoComponent } from './components/Geo.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'geo', component: GeoComponent }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class GeoRoutesModule { }
