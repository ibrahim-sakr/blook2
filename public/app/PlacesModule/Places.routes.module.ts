import { NgModule }              from '@angular/core';
import { RouterModule }          from '@angular/router';

import { PlacesRootComponent }   from './components/Places.root.component';
import { PlacesComponent }       from './components/Places.component';
import { PlacesCreateComponent } from './components/Places.create.component';
import { PlacesEditComponent }   from './components/Places.edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'places',
                component: PlacesRootComponent,
                children: [
                    { path: '',         component: PlacesComponent },
                    { path: 'create',   component: PlacesCreateComponent },
                    { path: 'edit/:id', component: PlacesEditComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class PlacesRoutesModule { }
