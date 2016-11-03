import { NgModule }          from '@angular/core';

import { RouterModule }      from '@angular/router';

import { MessagesComponent } from './components/Message.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'messages', component: MessagesComponent }
        ])
    ],
    exports: [ RouterModule ]
})
export class MessagesRoutesModule { }
