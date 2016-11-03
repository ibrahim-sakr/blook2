import { NgModule }                from '@angular/core';

import { RouterModule }            from '@angular/router';

import { PositionRootComponent }   from './components/Position.root.component';
import { PositionComponent }       from './components/Position.component';
import { PositionCreateComponent } from './components/Position.create.component';
import { PositionEditComponent }   from './components/Position.edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'positions',
                component: PositionRootComponent,
                children: [
                    { path: '', component: PositionComponent },
                    { path: 'create', component: PositionCreateComponent },
                    { path: 'edit/:id', component: PositionEditComponent },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class PositionRoutesModule { }
