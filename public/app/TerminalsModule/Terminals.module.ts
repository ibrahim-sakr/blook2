import { NgModule }                from '@angular/core';

import { TerminalRoutesModule }    from './Terminal.routes.module';

import { TerminalRootComponent }   from './components/Terminal.root.component';
import { TerminalComponent }       from './components/Terminal.component';
import { TerminalCreateComponent } from './components/Terminal.create.component';
import { TerminalEditComponent }   from './components/Terminal.edit.component';


@NgModule({
    imports: [
        TerminalRoutesModule
    ],
    declarations: [
        TerminalRootComponent,
        TerminalComponent,
        TerminalCreateComponent,
        TerminalEditComponent
    ],
    providers: []
})
export class TerminalsModule { }
