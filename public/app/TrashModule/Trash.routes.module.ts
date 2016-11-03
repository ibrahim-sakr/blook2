import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrashComponent } from './components/Trash.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'trash', component: TrashComponent }
        ])
    ],
    exports: [ RouterModule ]
})
export class TrashRoutesModule { }
