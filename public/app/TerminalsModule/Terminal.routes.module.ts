import { NgModule }                from '@angular/core';
import { RouterModule }            from '@angular/router';

import { TerminalRootComponent }   from './components/Terminal.root.component';
import { TerminalComponent }       from './components/Terminal.component';
import { TerminalCreateComponent } from './components/Terminal.create.component';
import { TerminalEditComponent }   from './components/Terminal.edit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'terminal',
                component: TerminalRootComponent,
                children: [
                    { path: '',         component: TerminalComponent },
                    { path: 'create',   component: TerminalCreateComponent },
                    { path: 'edit/:id', component: TerminalEditComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TerminalRoutesModule { }
