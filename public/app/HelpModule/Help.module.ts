import { NgModule }          from '@angular/core';

import { HelpRoutesModule } from './Help.routes.module';

import { HelpComponent }    from './components/Help.component';

@NgModule({
    imports: [ HelpRoutesModule ],
    declarations: [
        HelpComponent
    ],
})
export class HelpModule { }
