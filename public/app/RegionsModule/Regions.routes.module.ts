import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';
// -------------------------------------------------------------------------------
import { RegionsRootComponent }   from './components/Regions.root.component'; 
import { RegionsComponent }       from './components/Regions.component';
import { RegionsCreateComponent } from './components/Regions.create.component';
import { RegionsEditComponent }   from './components/Regions.edit.component';
// -------------------------------------------------------------------------------

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'regions',
                component: RegionsRootComponent,
                children: [
                    { path: '',         component: RegionsComponent },
                    { path: 'create',   component: RegionsCreateComponent },
                    { path: 'edit/:id', component: RegionsEditComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class RegionsRoutesModule { }
