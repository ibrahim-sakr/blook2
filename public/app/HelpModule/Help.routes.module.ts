import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HelpComponent } from './components/Help.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'help', component: HelpComponent }
        ])
    ],
    exports: [ RouterModule ]
})
export class HelpRoutesModule { }
