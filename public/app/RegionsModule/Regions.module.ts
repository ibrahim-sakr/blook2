import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';
// -------------------------------------------------------------------------------
import { RegionsRoutesModule }    from './Regions.routes.module';
// -------------------------------------------------------------------------------
import { RegionsRootComponent }   from './components/Regions.root.component';
import { RegionsComponent }       from './components/Regions.component';
import { RegionsCreateComponent } from './components/Regions.create.component';
import { RegionsEditComponent }   from './components/Regions.edit.component';
// -------------------------------------------------------------------------------

@NgModule({
    imports: [
        RegionsRoutesModule
    ],
    declarations: [
        RegionsRootComponent,
        RegionsComponent,
        RegionsCreateComponent,
        RegionsEditComponent
    ],
    providers: []
})
export class RegionsModule { }
