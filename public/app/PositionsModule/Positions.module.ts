import { NgModule }                from '@angular/core';

import { PositionRoutesModule }    from './Position.routes.module';

import { PositionRootComponent }   from './components/Position.root.component';
import { PositionComponent }       from './components/Position.component';
import { PositionCreateComponent } from './components/Position.create.component';
import { PositionEditComponent }   from './components/Position.edit.component';

@NgModule({
    imports: [ PositionRoutesModule ],
    declarations: [
        PositionRootComponent,
        PositionComponent,
        PositionCreateComponent,
        PositionEditComponent
    ],
    providers: []
})
export class PositionsModule { }
