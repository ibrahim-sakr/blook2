import { NgModule }          from '@angular/core';

import { TrashRoutesModule } from './Trash.routes.module';

import { TrashComponent }    from './components/Trash.component';

@NgModule({
    imports: [ TrashRoutesModule ],
    declarations: [
        TrashComponent
    ],
})
export class TrashModule { }
