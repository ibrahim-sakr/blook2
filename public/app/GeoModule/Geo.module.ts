import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GeoRoutesModule } from './Geo.routes.module';

import { GeoComponent } from './components/Geo.component';


@NgModule({
    imports: [
        GeoRoutesModule
    ],
    declarations: [
        GeoComponent
    ],
    providers: []
})
export class GeoModule { }
