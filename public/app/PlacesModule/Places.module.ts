import { NgModule }              from '@angular/core';

import { PlacesRoutesModule }    from './Places.routes.module';

import { PlacesRootComponent }   from './components/Places.root.component';
import { PlacesComponent }       from './components/Places.component';
import { PlacesCreateComponent } from './components/Places.create.component';
import { PlacesEditComponent }   from './components/Places.edit.component';

@NgModule({
    imports: [
        PlacesRoutesModule
    ],
    declarations: [
        PlacesRootComponent,
        PlacesComponent,
        PlacesCreateComponent,
        PlacesEditComponent
    ],
    providers: []
})
export class PlacesModule { }
